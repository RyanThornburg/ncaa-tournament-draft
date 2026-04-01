import { Hono } from "hono";
import authMiddleware from "../middleware";

const draft = new Hono<{ Bindings: Env }>();
// GET - returns the saved draft order, or empty if none exists
draft.get("/", async (c)=> {
    const {results: saved} = await c.env.DB.prepare(`
        SELECT d.pick_number, d.user_id, u.user_name as user_name
        FROM draft_order d
        JOIN users u ON u.id = d.user_id
        ORDER BY d.pick_number ASC
    `).all<{pick_number: number; user_id: string; user_name: string}>()

    return c.json({order: saved});
});

// POST /random - generates a random order from active users and saves to db
draft.post("/random", authMiddleware, async (c) => {
    const { results: users } = await c.env.DB.prepare(
        "SELECT id as user_id, user_name FROM users WHERE active = 1"
    ).all<{user_id: string; user_name: string}>();

    for (let i = users.length - 1; i > 0; i--) {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        const j = arr[0] % (i + 1);
        [users[i], users[j]] = [users[j], users[i]];
    }

    const order = users.map((u, i) => ({ pick_number: i + 1, ...u }));
    const statements: D1PreparedStatement[] = [
        c.env.DB.prepare("DELETE FROM draft_order"),
        ...order.map(({ pick_number, user_id }) =>
            c.env.DB.prepare("INSERT INTO draft_order (pick_number, user_id) VALUES (?, ?)").bind(pick_number, user_id)
        )
    ];

    await c.env.DB.batch(statements);
    return c.json({ order });
});


// PUT 
// Body: { order: string[] } - array of user_ids in pick order [0] is first
draft.put("/", authMiddleware, async (c) => {
    const body = await c.req.json<{order: string[]}>();

    if (!Array.isArray(body.order) || body.order.length === 0) {
        return c.json({error: "missing order"}, 400);
    }

    // verify users are active
    const placeholders = body.order.map(() => "?").join(",");
    const { results } = await c.env.DB.prepare(
        `SELECT id FROM users WHERE id IN (${placeholders}) AND active = 1`
    ).bind(...body.order).all();

    const found = new Set(results.map(r => r.id));
    const missing = body.order.filter(id => !found.has(id));
    if (missing.length) return c.json({ error: `Users not active: ${missing.join(", ")}` }, 404);

    const statements: D1PreparedStatement[] = [
        c.env.DB.prepare("DELETE FROM draft_order"),
        ...body.order.map(
            (user_id, i) =>
            c.env.DB.prepare("INSERT INTO draft_order (pick_number, user_id) VALUES (?, ?)").bind(i+1, user_id)
        )
    ];

    await c.env.DB.batch(statements);
    return c.json({ok: true, saved: body.order.length})
});

// DELETE - clear draft
draft.delete("/", authMiddleware, async(c)=>{
    await c.env.DB.prepare("DELETE FROM draft_order").run();
    return c.json({ok: true, message: "Draft order cleared"})
});

export default draft;