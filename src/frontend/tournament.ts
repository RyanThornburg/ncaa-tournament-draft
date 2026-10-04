import { Game } from "../types";
import { ROUND_POINTS, calculateUpsetPoints } from "../config";

const isDone = (g: Game) => g.game_status === "final" || g.game_status === "forfeit" || !!g.winner_team_id;

// Most recent server sync with the NCAA feed (every sync rewrites updated_at, stored as UTC)
export function lastSync(games: Game[]): number | null {
    let latest: number | null = null;
    for (const g of games) {
        if (!g.updated_at) continue;
        const t = Date.parse(g.updated_at.replace(" ", "T") + "Z");
        if (!isNaN(t) && (latest === null || t > latest)) latest = t;
    }
    return latest;
}

// Points a team earns by winning this game, including the upset bonus
export function winValue(g: Game, teamId: string): number {
    const mine = g.team_1_id === teamId ? g.team_1_seed : g.team_2_seed;
    const theirs = g.team_1_id === teamId ? g.team_2_seed : g.team_1_seed;
    if (mine == null || theirs == null) return ROUND_POINTS[g.round] ?? 0;
    return calculateUpsetPoints(mine, theirs, g.round);
}

// Bracket tree: a game at position NXX feeds position (N+1)YY where YY = ceil(XX / 2)
export const parentPos = (pos: number) => (Math.floor(pos / 100) + 1) * 100 + Math.ceil((pos % 100) / 2);

/**
 * Most points a player can still add, given bracket collisions between their own teams.
 * Counts round points only for games not yet played (upset bonuses aren't knowable in advance).
 */
export function maxRemaining(games: Game[], owners: Record<string, string>, user: string): number {
    const byPos = new Map<number, Game>();
    const children = new Map<number, Game[]>();
    for (const g of games) {
        const pos = parseInt(g.bracket_position_id ?? "");
        if (isNaN(pos) || g.round < 2) continue;
        byPos.set(pos, g);
        if (g.round < 7) {
            const p = parentPos(pos);
            children.set(p, [...(children.get(p) ?? []), g]);
        }
    }

    // team_id -> best future points for `user` within this game's subtree, if that team wins it
    const best = (pos: number): Map<string, number> => {
        const g = byPos.get(pos);
        if (!g) return new Map();
        if (isDone(g)) return g.winner_team_id ? new Map([[g.winner_team_id, 0]]) : new Map();
        let sides: Map<string, number>[];
        if (g.round === 2) {
            sides = [g.team_1_id, g.team_2_id].map(id => id ? new Map([[id, 0]]) : new Map());
        } else {
            const kids = (children.get(pos) ?? []).map(k => best(parseInt(k.bracket_position_id!)));
            // a known entrant beats an unresolved subtree
            if (g.team_1_id && !kids.some(k => k.has(g.team_1_id!))) kids.push(new Map([[g.team_1_id, 0]]));
            if (g.team_2_id && !kids.some(k => k.has(g.team_2_id!))) kids.push(new Map([[g.team_2_id, 0]]));
            sides = kids.slice(0, 2);
        }
        const out = new Map<string, number>();
        sides.forEach((side, i) => {
            const other = sides[1 - i];
            const otherBest = other && other.size ? Math.max(...other.values()) : 0;
            for (const [team, pts] of side) {
                out.set(team, pts + otherBest + (owners[team] === user ? ROUND_POINTS[g.round] ?? 0 : 0));
            }
        });
        return out;
    };

    const root = byPos.get(701) ? best(701) : new Map<string, number>();
    return root.size ? Math.max(...root.values()) : 0;
}

// Region order as the bracket draws it (by lowest R64 position), falling back to alphabetical
export function regionOrder(games: Game[], regions: string[]): string[] {
    const minPos: Record<string, number> = {};
    for (const g of games) {
        if (g.round !== 2 || !g.region || !g.bracket_position_id) continue;
        const pos = parseInt(g.bracket_position_id);
        if (minPos[g.region] === undefined || pos < minPos[g.region]) minPos[g.region] = pos;
    }
    return [...regions].sort((a, b) => (minPos[a] ?? 999) - (minPos[b] ?? 999) || a.localeCompare(b));
}

export const championshipDecided = (games: Game[]) => games.some(g => g.round === 7 && !!g.winner_team_id);

// ── Roads: where a team goes from here ───────────────────────────────────

export interface RoadStop {
    round: number;
    game: Game | null;
    status: "live" | "next" | "future";
    opponents: string[];      // team ids that could be across the court
    value: number;            // base points for winning this round (no upset bonus)
}

function indexBracket(games: Game[]) {
    const byPos = new Map<number, Game>();
    const children = new Map<number, number[]>();
    for (const g of games) {
        const pos = parseInt(g.bracket_position_id ?? "");
        if (isNaN(pos) || g.round < 2) continue;
        byPos.set(pos, g);
        if (g.round < 7) {
            const p = parentPos(pos);
            children.set(p, [...(children.get(p) ?? []), pos]);
        }
    }
    return { byPos, children };
}

// Teams that can still come out of the game at `pos`
function contenders(pos: number, idx: ReturnType<typeof indexBracket>): string[] {
    const g = idx.byPos.get(pos);
    if (g?.winner_team_id) return [g.winner_team_id];
    const known = [g?.team_1_id, g?.team_2_id].filter((t): t is string => !!t);
    if (!g || g.round === 2) return known;
    const fromKids = (idx.children.get(pos) ?? []).flatMap(c => contenders(c, idx));
    return [...new Set([...known, ...fromKids])];
}

const posOf = (g: Game) => parseInt(g.bracket_position_id ?? "");

/** The remaining road for a team that is still alive, current game first. Empty if eliminated or champion. */
export function teamRoad(games: Game[], teamId: string): RoadStop[] {
    const idx = indexBracket(games);
    const mine = games.filter(g => g.round >= 2 && (g.team_1_id === teamId || g.team_2_id === teamId)).sort((a, b) => b.round - a.round);
    const latest = mine[0];
    if (!latest) return [];
    if (latest.winner_team_id && latest.winner_team_id !== teamId) return [];

    const stops: RoadStop[] = [];
    let from = posOf(latest);
    if (!latest.winner_team_id) {
        const opp = latest.team_1_id === teamId ? latest.team_2_id : latest.team_1_id;
        const sibling = (idx.children.get(from) ?? []).map(c => contenders(c, idx)).find(cs => !cs.includes(teamId));
        stops.push({
            round: latest.round, game: latest,
            status: latest.game_status === "live" ? "live" : "next",
            opponents: opp ? [opp] : (sibling ?? []),
            value: ROUND_POINTS[latest.round] ?? 0,
        });
    }
    while (from < 700) {
        const up = parentPos(from);
        const other = (idx.children.get(up) ?? []).filter(c => c !== from);
        const opponents = other.flatMap(c => contenders(c, idx));
        const g = idx.byPos.get(up) ?? null;
        const round = g?.round ?? Math.floor(up / 100);
        stops.push({ round, game: g, status: "future", opponents, value: ROUND_POINTS[round] ?? 0 });
        from = up;
    }
    return stops;
}

/** Round a team went out in, or null while alive. */
export function eliminatedIn(games: Game[], teamId: string): number | null {
    const lost = games.find(g => g.winner_team_id && g.winner_team_id !== teamId && (g.team_1_id === teamId || g.team_2_id === teamId));
    return lost ? lost.round : null;
}

/** Points a team has banked from games already won. */
export function bankedPoints(games: Game[], teamId: string): number {
    return games.filter(g => g.winner_team_id === teamId).reduce((sum, g) => sum + winValue(g, teamId), 0);
}

/** The round being played: lowest round with an unfinished, fully set game; otherwise the last round with games. */
export function currentRound(games: Game[]): number {
    const open = games.filter(g => g.round >= 2 && g.team_1_id && g.team_2_id && !g.winner_team_id);
    if (open.length) return Math.min(...open.map(g => g.round));
    const played = games.filter(g => g.round >= 2 && g.winner_team_id);
    return played.length ? Math.max(...played.map(g => g.round)) : 2;
}
