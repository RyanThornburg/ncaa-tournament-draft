// Updating users is handled from admin panel

import { Hono } from "hono";

const users = new Hono<{ Bindings: Env }>();
users.get("/", async (c) => {
    const activeOnly = c.req.query("active") === "1";
    const {results } = await c.env.DB.prepare(
        activeOnly
        ? "SELECT * from users WHERE active = 1 ORDER BY user_name"
        : "SELECT * from users ORDER BY user_name"
    ).all();
    return c.json(results);
});

users.get("/:id", async (c) => {
    const user = await c.env.DB.prepare(
        "SELECT * FROM users WHERE id = ?"
    ).bind(c.req.param("id")).first();
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(user);
});

export default users;