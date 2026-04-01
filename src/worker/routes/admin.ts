import { Hono } from "hono";
import { requireAdmin } from "../middleware";
import SyncGameData from "../jobs/sync-games";
import type { AppVariables } from "../../types";

const admin = new Hono<{ Bindings: Env; Variables: AppVariables }>();

// GET /admin/me
admin.get("/me", requireAdmin, async (c) => {
    const user = c.get("currentUser");
    const email = user?.email ?? "admin@local";
    return c.json({ email, isAdmin: true });
});

// Admin user setup
admin.post("/users", requireAdmin, async (c) => {
    const body = await c.req.json<{ name: string; displayName?: string; email?: string }>();
    const user_name = body.name?.trim();
    const display_name = body.name?.trim() ?? user_name;
    if (!user_name || user_name.length > 50) return c.json({ error: "Invalid name - user name should be less than 50 characters" }, 400);
    if (display_name.length > 50) return c.json({ error: "Invalid name - display name should be less than 50 characters" }, 400);
    if (!user_name) return c.json({ error: "name is required" }, 400);

    const result = await c.env.DB.prepare(
        "INSERT INTO users (user_name, display_name, email, active) VALUES (?, ?, ?, 1) RETURNING *"
    )
        .bind(user_name, body.displayName?.trim() ?? user_name, body.email ?? null)
        .first();
    return c.json(result, 201);
});

admin.patch("/users/:id", requireAdmin, async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{
        name?: string;
        displayName?: string;
        email?: string;
        active?: boolean;
    }>();

    const user = await c.env.DB.prepare("SELECT * FROM users WHERE id = ?")
        .bind(id)
        .first<{ user_name: string; display_name: string; email: string | null; active: number }>();

    if (!user) return c.json({ error: "User not found" }, 404);

    const result = await c.env.DB.prepare(
        `UPDATE users SET
            user_name = ?,
            display_name = ?,
            email = ?,
            active = ?
        WHERE id = ?
        RETURNING *`
    )
        .bind(
            body.name?.trim() ?? user.user_name,
            body.displayName?.trim() ?? user.display_name,
            body.email !== undefined ? body.email : user.email,
            body.active !== undefined ? (body.active ? 1 : 0) : user.active,
            id
        )
        .first();
    return c.json(result);
});

admin.post("/sync-games", requireAdmin, async (c) => {
    await SyncGameData(c.env.DB);
    return c.json({ ok: true });
});

export default admin;
