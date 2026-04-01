const BASE = import.meta.env.VITE_API_URL ?? "";

// Only set in local dev prod auth uses CF Access cookie
const DEV_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "";

async function req(method: string, path: string, body?: unknown) {
    const headers: Record<string, string> = {}
    if (body) headers['Content-Type'] = 'application/json';
    if (DEV_TOKEN) headers['Authorization'] = `Bearer ${DEV_TOKEN}`;

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText})) as { error?: string };
        throw new Error(err.error ?? res.statusText);
    }

    return res.json();
}

export const api = {
    // Users
    getUsers: (activeOnly = true) =>
        req("GET", activeOnly ? "/users?active=1" : "/users"),
    createUser: (name: string, displayName?: string, email?: string) =>
        req("POST", "/admin/users", {name, displayName, email}),
    updateUser: (id: string, patch: {name?: string; displayName?: string; email?: string; active?: boolean}) =>
        req("PATCH", `/admin/users/${id}`, patch),

    // Teams
    getTeams: () => req("GET", "/teams"),

    // Draft order
    getDraftOrder: () => req("GET", "/draft-order"),
    setDraftOrder: (order: string[]) => req("PUT", "/draft-order", {order}),
    clearDraftOrder: () => req("DELETE", "/draft-order"),
    setDraftOrderRandom: () => req("POST", "/draft-order/random"),

    // Picks
    getPicks: () => req("GET", "/picks"),
    postPicks: (user_id: string, team_id: string, pick_order: number) =>
        req("POST", "/picks", {user_id, team_id, pick_order}),
    deleteLastPick: (expected_pick_order: number) => req("DELETE", "/picks/last", {expected_pick_order: expected_pick_order}),
    deletePicks: () => req("DELETE", "/picks"),

    // History
    getHistory: () => req("GET", "/history"),
    getHistoryYear: (year: number) => req("GET", `/history/${year}`),
    getLeaderboard: () => req("GET", "/leaderboard"),

    // Games
    getGames: () => req("GET", "/games"),

    // Archive
    archiveSeason: (year: number, notes?: string) => req("POST", "/archive", { year, notes }),

    // Auth
    getMe: () => req("GET", "/admin/me"),
};
