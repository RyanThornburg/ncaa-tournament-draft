import { Hono } from "hono";
import { cors } from "hono/cors";
import users from "./routes/users"
import teams from "./routes/teams";
import picks from "./routes/picks";
import games from "./routes/games";
import archive from "./routes/archive";
import history from "./routes/history";
import draft from "./routes/draft";
import leaderboard from "./routes/leaderboard";
import adminRoutes from "./routes/admin";
import SyncGameData from "./jobs/sync-games";
export interface Env {
    DB: D1Database;
    SECRET: SecretsStoreSecret;
    CORS_ORIGIN: string;
    CF_TEAM_DOMAIN: string;
    CF_ACCESS_AUD: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(
    "*",
    cors({
        origin: (origin, c) => {
            const allowed = c.env.CORS_ORIGIN;
            return origin === allowed ? origin : null;
        },
        allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"]
    })
)

app.route("/users", users);
app.route("/teams", teams);
app.route("/picks", picks);
app.route("/games", games);
app.route("/history", history);
app.route("/draft-order", draft);
app.route("/leaderboard", leaderboard);
app.route("/archive", archive);
app.route("/admin", adminRoutes);

export default {
    fetch: app.fetch,
    async scheduled(_event: ScheduledEvent, env: Env) {
        await SyncGameData(env.DB);
    }
};
