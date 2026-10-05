import { Game, LeaderboardEntry } from "../types";
import { calculateUpsetPoints } from "../config";
import { outLabel, roundLabel, teamRoad, tipTime } from "./tournament";

interface NamedGame extends Game {
    team_1_name?: string | null;
    team_2_name?: string | null;
}

/** One line for the reader's standings row when nothing of theirs is scheduled: "Michigan St. · Elite 8 vs Florida / Maryland winner". */
export function waitingNote(entry: LeaderboardEntry, games: NamedGame[]): string | null {
    const team = entry.picks.find(p => !p.eliminated);
    if (!team) return null;
    const stop = teamRoad(games, team.team_id)[0];
    if (!stop) return null;
    const name = (id: string) => {
        const g = games.find(x => (x.team_1_id === id && x.team_1_name) || (x.team_2_id === id && x.team_2_name));
        return (g?.team_1_id === id ? g.team_1_name : g?.team_2_name) ?? "TBD";
    };
    const opp = stop.opponents.length === 0 ? "opponent TBD"
        : stop.opponents.length <= 2 ? `vs ${stop.opponents.map(name).join(" / ")}${stop.opponents.length === 2 ? " winner" : ""}`
        : `${stop.opponents.length} possible opponents`;
    const others = entry.picks.filter(p => !p.eliminated).length - 1;
    return `${team.team_name} · ${roundLabel(stop.round)} ${opp}${others > 0 ? ` · +${others} more alive` : ""}`;
}

const fmt = (n: number) => (Math.round(n * 10) / 10).toString();

// The reader's teams when none of them has a game set: the survivors and who they're waiting on,
// then the Out list. With nobody left, it reads as the obituary column. Shown in place of Your games.
export default function YourTeams({ entry, games, owners, max }: { entry: LeaderboardEntry; games: NamedGame[]; owners: Record<string, string>; max: number }) {
    const nameOf = (id: string) => {
        for (const g of games) {
            if (g.team_1_id === id && g.team_1_name) return g.team_1_name;
            if (g.team_2_id === id && g.team_2_name) return g.team_2_name;
        }
        return "TBD";
    };
    const seedOf = (id: string) => {
        for (const g of games) {
            if (g.team_1_id === id && g.team_1_seed != null) return g.team_1_seed;
            if (g.team_2_id === id && g.team_2_seed != null) return g.team_2_seed;
        }
        return null;
    };

    const alive = entry.picks.filter(p => !p.eliminated);
    const out = entry.picks.filter(p => p.eliminated)
        .sort((a, b) => (b.eliminated_round ?? 0) - (a.eliminated_round ?? 0) || a.seed - b.seed);
    const outPts = out.reduce((s, p) => s + p.points_earned, 0);

    const survivors = alive.map(p => {
        const stop = teamRoad(games, p.team_id)[0];
        const opps = stop?.opponents ?? [];
        const lastWin = games.filter(g => g.winner_team_id === p.team_id).sort((a, b) => b.round - a.round)[0];
        const beat = lastWin ? (lastWin.team_1_id === p.team_id ? lastWin.team_2_id : lastWin.team_1_id) : null;
        // the game deciding the opponent, for its tip time
        const feeder = games.find(g => !g.winner_team_id && opps.length > 0 && opps.includes(g.team_1_id ?? "") && opps.includes(g.team_2_id ?? ""));
        return { p, stop, opps, beat, feeder };
    });

    const last = out[0];
    const lastLoss = last ? games.find(g => g.round === last.eliminated_round && (g.team_1_id === last.team_id || g.team_2_id === last.team_id) && !!g.winner_team_id) : undefined;

    return (
        <section className="yt" aria-labelledby="yt-head">
            <div className="section-row yg-head-row">
                <h2 className="yg-head" id="yt-head">Your teams</h2>
                <span className="yg-count">{alive.length} of {entry.picks.length} alive · {fmt(entry.total_points)} pts{alive.length ? ` · max ${fmt(max)}` : ""}</span>
            </div>
            <div className={`yt-body${alive.length ? "" : " none"}`}>
                {alive.length > 0 ? (
                    <div className="yt-alive">
                        {survivors.map(({ p, stop, opps, beat, feeder }) => (
                            <div key={p.team_id} className="yt-row">
                                <span className="yg-when">
                                    <strong>{stop ? roundLabel(stop.round) : ""}</strong>
                                    <span className="yg-region">{stop?.game?.start_time_epoch ? tipTime(stop.game.start_time_epoch) : "TBD"}</span>
                                </span>
                                <span className="yg-game">
                                    <span className="yg-team">{p.team_name}</span>
                                    <span className="yg-opp">
                                        {p.seed} seed · +{fmt(p.points_earned)} so far{beat ? ` · beat ${seedOf(beat) ?? ""} ${nameOf(beat)}` : ""}
                                    </span>
                                    <span className="yg-opp">
                                        {opps.length === 0 ? "Opponent not set yet"
                                            : opps.length <= 2
                                                ? `Waiting on ${opps.map(o => `${seedOf(o) ?? ""} ${nameOf(o)}`.trim()).join(" / ")}${opps.some(o => owners[o]) ? ` (${opps.map(o => owners[o] ?? "nobody").join(" / ")})` : ""}${feeder?.start_time_epoch ? `, ${feeder.game_status === "live" ? "playing now" : tipTime(feeder.start_time_epoch)}` : ""}`
                                                : `Waiting on ${opps.length} possible opponents`}
                                    </span>
                                </span>
                                {stop && opps.length > 0 && opps.length <= 2 && (
                                    <span className="yt-vals">
                                        {opps.map(o => {
                                            const os = seedOf(o);
                                            const v = os != null ? calculateUpsetPoints(p.seed, os, stop.round) : stop.value;
                                            return <span key={o} className="yg-val"><strong>+{fmt(v)}</strong><span>vs {nameOf(o)}</span></span>;
                                        })}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="yt-obit">
                        <h3 className="yt-obit-head">Out: all {entry.picks.length}</h3>
                        {last && (
                            <p className="yg-opp">
                                {last.team_name} was the last{lastLoss ? `, beaten by ${seedOf(lastLoss.winner_team_id!) ?? ""} ${nameOf(lastLoss.winner_team_id!)} in the ${roundLabel(lastLoss.round, "long")}` : ""}.
                            </p>
                        )}
                    </div>
                )}
                {out.length > 0 && (
                    <div className="yt-out">
                        <div className="yt-out-head label"><span>Out · {out.length}</span><span>{fmt(outPts)} pts</span></div>
                        <ol className="yt-out-list">
                            {out.map(p => (
                                <li key={p.team_id}>
                                    <span className="yt-seed">{p.seed}</span>
                                    <span className="yt-name">{p.team_name}</span>
                                    <span className="yt-round">{outLabel(p.eliminated_round ?? 2)}</span>
                                    <span className="yt-pts">{p.points_earned > 0 ? `+${fmt(p.points_earned)}` : "—"}</span>
                                </li>
                            ))}
                        </ol>
                        {alive.length === 0 && <div className="yt-banked"><span className="label">Banked, final</span><strong>{fmt(entry.total_points)}</strong></div>}
                    </div>
                )}
            </div>
        </section>
    );
}
