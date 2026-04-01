import { Context, Next } from "hono";
import type { User } from "../types";

// Validate Cloudflare Access JWT
async function verifyCloudflareJWT(
    token: string,
    teamDomain: string,
    aud: string
): Promise<{ email: string; sub: string } | null> {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const b64d = (s: string) =>
            atob(s.replace(/-/g, "+").replace(/_/g, "/"));

        const header = JSON.parse(b64d(parts[0])) as { alg: string; kid: string };
        const payload = JSON.parse(b64d(parts[1])) as {
            exp: number;
            aud: string | string[];
            email: string;
            sub: string;
        };

        if (payload.exp < Math.floor(Date.now() / 1000)) return null;

        const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
        if (!audiences.includes(aud)) return null;

        // check cache instead of fetching every time
        const cache = caches.default;
        const cacheKey = new Request(`https://jwks-cache/${teamDomain}`);
        let certsRes = await cache.match(cacheKey);
        if (!certsRes){
            certsRes = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
            const cached = new Response(certsRes.body, certsRes);
            cached.headers.set('Cache-Control', 'max-age=3600');
            await cache.put(cacheKey, cached);
        }
        if (!certsRes.ok) return null;

        const { keys } = (await certsRes.json()) as {
            keys: (JsonWebKey & { kid: string })[];
        };
        const jwk = keys.find((k) => k.kid === header.kid);
        if (!jwk) return null;

        let cryptoKey: CryptoKey;
        let verifyAlg: string | { name: string; hash: string };

        if (header.alg === "RS256") {
            cryptoKey = await crypto.subtle.importKey(
                "jwk",
                jwk,
                { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
                false,
                ["verify"]
            );
            verifyAlg = "RSASSA-PKCS1-v1_5";
        } else {
            cryptoKey = await crypto.subtle.importKey(
                "jwk",
                jwk,
                { name: "ECDSA", namedCurve: "P-256" },
                false,
                ["verify"]
            );
            verifyAlg = { name: "ECDSA", hash: "SHA-256" };
        }

        const sigData = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
        const sigBytes = Uint8Array.from(b64d(parts[2]), (c) =>
            c.charCodeAt(0)
        );

        const valid = await crypto.subtle.verify(verifyAlg, cryptoKey, sigBytes, sigData);
        if (!valid) return null;

        return { email: payload.email, sub: payload.sub };
    } catch {
        return null;
    }
}

// return identity
export async function getCFIdentity(
    c: Context
): Promise<{ email: string; sub: string } | null> {
    const teamDomain: string = c.env.CF_TEAM_DOMAIN;
    const aud: string = c.env.CF_ACCESS_AUD;
    if (!teamDomain || !aud) return null;

    const token =
        c.req.header("CF-Access-Jwt-Assertion") ??
        getCookieValue(c.req.header("cookie") ?? "", "CF_Authorization");

    if (!token) return null;
    return verifyCloudflareJWT(token, teamDomain, aud);
}

// timing safe comparision - probably overkill
function timingSafeEqual(a: string, b: string): boolean {
    const enc = new TextEncoder();
    const aBuf = enc.encode(a);
    const bBuf = enc.encode(b);
    if (aBuf.byteLength !== bBuf.byteLength) {
        crypto.subtle.timingSafeEqual(aBuf, aBuf);
        return false;
    }
    return crypto.subtle.timingSafeEqual(aBuf, bBuf);
}
function getCookieValue(cookieHeader: string, name: string): string | null {
    const match = cookieHeader
        .split(";")
        .map((p) => p.trim())
        .find((p) => p.startsWith(`${name}=`));
    return match ? match.slice(name.length + 1) : null;
}

// prod uses CF access, local dev uses token
const authMiddleware = async (c: Context, next: Next) => {
    const identity = await getCFIdentity(c);
    if (identity) return next();

    // Fall back to Bearer token (local dev)
    if (c.env.NODE_ENV === "development") {
        const authHeader = c.req.header("Authorization");
        if (authHeader) {
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;
            const secret = await c.env.SECRET.get();
            if (timingSafeEqual(token, secret)) return next();
        }
    }

    return c.json({ error: "Unauthorized" }, 401);
};

export default authMiddleware;

// prod needs identity to match admin user email, stores in currentUser
// local dev uses token
export const requireAdmin = async (c: Context, next: Next) => {
    const identity = await getCFIdentity(c);
    if (identity) {
        const user = await (c.env.DB as D1Database)
            .prepare("SELECT * FROM users WHERE email = ?")
            .bind(identity.email)
            .first<User>();

        if (!user || user.role !== "admin") {
            return c.json({ error: "Forbidden" }, 403);
        }

        c.set("currentUser", user);
        return next();
    }

    // Bearer token fallback for local dev (skips role check)
    if (c.env.NODE_ENV === "development") {
        const authHeader = c.req.header("Authorization");
        if (authHeader) {
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;
            const secret = await c.env.SECRET.get();
            if (timingSafeEqual(token, secret)) return next();
        }
    }

    return c.json({ error: "Unauthorized" }, 401);
};
