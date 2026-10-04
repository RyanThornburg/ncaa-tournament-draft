import { Game } from "../types";
import { Chevron } from "./Icons";
import { currentRound, roundLabel, teamRoad, tipTime, winValue } from "./tournament";

interface NamedGame extends Game {
    team_1_name?: string | null;
    team_2_name?: string | null;
}

const MAX_ROWS = 4;

// "What do I watch tonight?": the reader's surviving teams with a game set (live first, then by tip),
// each with the opponent, its owner, and what a win is worth. Renders nothing when there's no such game.
export function yourGameRows(games: NamedGame[], owners: Record<string, string>, me: string) {
    const mine = Object.keys(owners).filter(id => owners[id] === me);
    return mine.flatMap(id => {
        const stop = teamRoad(games, id)[0];
        const g = stop?.game as NamedGame | null | undefined;
        if (!stop || stop.status === "future" || !g || !g.team_1_id || !g.team_2_id) return [];
        const first = g.team_1_id === id;
        return [{
            id, g,
            live: stop.status === "live",
            name: (first ? g.team_1_name : g.team_2_name) ?? "",
            mine: (first ? g.team_1_score : g.team_2_score) ?? 0,
            theirs: (first ? g.team_2_score : g.team_1_score) ?? 0,
            oppId: (first ? g.team_2_id : g.team_1_id)!,
            oppName: (first ? g.team_2_name : g.team_1_name) ?? "TBD",
            oppSeed: first ? g.team_2_seed : g.team_1_seed,
            value: winValue(g, id),
        }];
    }).sort((a, b) => Number(b.live) - Number(a.live) || (a.g.start_time_epoch ?? 0) - (b.g.start_time_epoch ?? 0));
}

export default function YourGames({ games, owners, me, onOpenGames }: { games: NamedGame[]; owners: Record<string, string>; me: string; onOpenGames: () => void }) {
    const rows = yourGameRows(games, owners, me);
    if (rows.length === 0) return null;

    const round = currentRound(games);
    const inRound = games.filter(g => g.round === round && g.team_1_id && g.team_2_id).length;
    const shown = rows.slice(0, MAX_ROWS);
    const more = rows.length - shown.length;

    return (
        <section className="yg" aria-labelledby="yg-head">
            <div className="section-row yg-head-row">
                <h2 className="yg-head" id="yg-head">Your games</h2>
                <span className="yg-count">{roundLabel(round)} · {rows.length} of yours{rows.some(r => r.live) ? " on now" : " next"}</span>
            </div>
            <ol className="yg-list">
                {shown.map(r => (
                    <li key={r.id} className={`yg-row${r.live ? " live" : ""}`}>
                        <span className="yg-when">
                            {r.live ? <span className="live-tag">Live</span> : <strong>{tipTime(r.g.start_time_epoch) || "TBD"}</strong>}
                            <span className="yg-region">{r.g.region ?? roundLabel(r.g.round)}</span>
                        </span>
                        <span className="yg-game">
                            <span className="yg-team">
                                {r.name}
                                {r.live && <span className="yg-score">{r.mine}–{r.theirs}</span>}
                            </span>
                            <span className="yg-opp">
                                vs {r.oppSeed ? `${r.oppSeed} ` : ""}{r.oppName}{owners[r.oppId] ? ` · ${owners[r.oppId]}` : ""}
                            </span>
                        </span>
                        <span className="yg-val">
                            <strong>+{r.value}</strong>
                            <span>if they win</span>
                        </span>
                    </li>
                ))}
            </ol>
            <button className="link-btn yg-more" onClick={onOpenGames}>
                {more > 0 ? `${more} more of yours, and all ${inRound} ${roundLabel(round)} games, in Bracket` : `All ${inRound} ${roundLabel(round)} games in Bracket`}
                <Chevron dir="right" size={10} />
            </button>
        </section>
    );
}
