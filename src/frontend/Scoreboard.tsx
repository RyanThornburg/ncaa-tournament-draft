import { BoxScore, Ctx, NamedGame } from "./BracketViews";
import { currentRound } from "./tournament";

// The rest of the slate for the desktop rail: live games, then the round's next tips, leaving out
// the reader's own games (Your games, just above, already carries those) so nothing says it three times.
export default function Scoreboard({ games, owners, me }: { games: NamedGame[]; owners: Record<string, string>; me: string }) {
    const names: Record<string, string> = {};
    const seeds: Record<string, number> = {};
    for (const g of games) {
        if (g.team_1_id && g.team_1_name) names[g.team_1_id] = g.team_1_name;
        if (g.team_2_id && g.team_2_name) names[g.team_2_id] = g.team_2_name;
        if (g.team_1_id && g.team_1_seed != null) seeds[g.team_1_id] = g.team_1_seed;
        if (g.team_2_id && g.team_2_seed != null) seeds[g.team_2_id] = g.team_2_seed;
    }
    const ctx: Ctx = { games, owners, names, seeds };
    const mine = (g: NamedGame) => !!me && (owners[g.team_1_id ?? ""] === me || owners[g.team_2_id ?? ""] === me);
    const round = currentRound(games);
    const live = games.filter(g => g.game_status === "live" && !mine(g));
    const next = games
        .filter(g => g.round === round && !g.winner_team_id && g.game_status !== "live" && g.team_1_id && g.team_2_id && !mine(g))
        .sort((a, b) => (a.start_time_epoch ?? 0) - (b.start_time_epoch ?? 0))
        .slice(0, 4);
    if (live.length === 0 && next.length === 0) return null;

    return (
        <section className="sb" aria-labelledby="sb-head">
            <div className="section-row yg-head-row">
                <h2 className="yg-head" id="sb-head">Around the pool</h2>
                <span className="yg-count">{live.length ? `${live.length} live` : "Nothing live"}{next.length ? ` · ${next.length} next` : ""}</span>
            </div>
            {live.map(g => <BoxScore key={g.id} g={g} ctx={ctx} me={me} />)}
            {next.length > 0 && <h3 className="sb-sub label">Up next</h3>}
            {next.map(g => <BoxScore key={g.id} g={g} ctx={ctx} me={me} />)}
        </section>
    );
}
