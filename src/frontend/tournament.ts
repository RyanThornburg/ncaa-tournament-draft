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
const parentPos = (pos: number) => (Math.floor(pos / 100) + 1) * 100 + Math.ceil((pos % 100) / 2);

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
