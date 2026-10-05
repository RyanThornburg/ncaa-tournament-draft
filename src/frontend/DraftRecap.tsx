import { useState } from "react";
import { DraftOrderEntry, LeaderboardEntry } from "../types";
import { Chevron } from "./Icons";
import { outLabel } from "./tournament";
import { setUrlParams, urlParam } from "./url";

type View = "board" | "ledger";

interface RecapPick {
    pick: number;
    round: number;
    player: string;
    team: string;
    seed: number;
    points: number;
    out: boolean;
    outRound: number | null;
    value: number; // points minus the average points of its draft round
}

const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
const signed = (n: number) => (n > 0 ? `+${fmt(n)}` : n < 0 ? `−${fmt(-n)}` : "±0");

// After the draft: the board (as it happened) and the ledger (who drafted well). The board opens
// through the Round of 32, while few teams are struck; the ledger opens from the Sweet 16, once
// results give the value math something to say. The switch isn't remembered, so the hand-off holds.
export default function DraftRecap({ order, leaderboard, tournamentRound }: { order: DraftOrderEntry[]; leaderboard: LeaderboardEntry[]; tournamentRound: number }) {
    const linked = urlParam("view");
    const [choice, setChoice] = useState<View | null>(linked === "board" || linked === "ledger" ? linked : null);
    const view: View = choice ?? (tournamentRound >= 4 ? "ledger" : "board");
    const choose = (v: View) => { setChoice(v); setUrlParams({ view: v }); };

    const size = order.length || 8;
    const raw = leaderboard.flatMap(e => e.picks.map(p => ({
        pick: p.pick_order, round: Math.ceil(p.pick_order / size), player: e.user_name, team: p.team_name, seed: p.seed,
        points: p.points_earned, out: !!p.eliminated, outRound: p.eliminated_round ?? null,
    })));
    const rounds = [...new Set(raw.map(p => p.round))].sort((a, b) => a - b);
    const avg: Record<number, number> = {};
    for (const r of rounds) {
        const inRound = raw.filter(p => p.round === r);
        avg[r] = inRound.reduce((s, p) => s + p.points, 0) / inRound.length;
    }
    const picks: RecapPick[] = raw.map(p => ({ ...p, value: p.points - avg[p.round] })).sort((a, b) => a.pick - b.pick);
    if (picks.length === 0) return null;

    const byValue = [...picks].sort((a, b) => b.value - a.value || a.pick - b.pick);
    const anyPoints = picks.some(p => p.points > 0);
    const steal = anyPoints ? byValue[0] : null;
    const bust = anyPoints ? [...picks].sort((a, b) => a.value - b.value || a.pick - b.pick)[0] : null;

    return (
        <div className="recap">
            <div className="recap-top">
                <div className="seg recap-seg" role="group" aria-label="Draft recap view">
                    {(["board", "ledger"] as View[]).map(v => (
                        <button key={v} className={view === v ? "on" : ""} aria-pressed={view === v} onClick={() => choose(v)}>
                            {v === "board" ? "The board" : "The ledger"}
                        </button>
                    ))}
                </div>
                {view === "board" && steal && bust && (
                    <dl className="recap-calls">
                        <div><dt>Steal</dt><dd><strong>{steal.team} · {steal.player}, pick {steal.pick}</strong> {steal.seed} seed, round {steal.round}. {fmt(steal.points)} pts, {signed(steal.value)} on the round's average.{steal.out ? ` Out in the ${outLabel(steal.outRound ?? 2)}.` : " Still alive."}</dd></div>
                        <div><dt>Bust</dt><dd><strong>{bust.team} · {bust.player}, pick {bust.pick}</strong> {bust.seed} seed, round {bust.round}. {fmt(bust.points)} pts, {signed(bust.value)} on the round's average.{bust.out ? ` Out in the ${outLabel(bust.outRound ?? 2)}.` : " Still alive."}</dd></div>
                    </dl>
                )}
            </div>
            {view === "board"
                ? <Board picks={picks} order={order} rounds={rounds} steal={steal} bust={bust} />
                : <Ledger picks={byValue} order={order} leaderboard={leaderboard} avg={avg} rounds={rounds} onBoard={() => choose("board")} />}
        </div>
    );
}

function Cell({ p, tag }: { p: RecapPick; tag?: string }) {
    return (
        <div className={`recap-cell${p.out ? " out" : ""}${tag ? " called" : ""}`}>
            <span className="recap-cell-meta"><span>#{p.pick}</span><span>{tag ?? `${p.seed} seed`}</span></span>
            <span className="recap-cell-team">{p.team}</span>
            <span className="recap-cell-meta"><span>{p.out ? `out ${outLabel(p.outRound ?? 2)}` : "alive"}</span><strong>{p.points > 0 ? fmt(p.points) : "—"}</strong></span>
        </div>
    );
}

function Board({ picks, order, rounds, steal, bust }: { picks: RecapPick[]; order: DraftOrderEntry[]; rounds: number[]; steal: RecapPick | null; bust: RecapPick | null }) {
    const [phoneRound, setPhoneRound] = useState(rounds[0]);
    const at = (player: string, round: number) => picks.find(p => p.player === player && p.round === round);
    const tagOf = (p: RecapPick) => (p === steal ? "Steal" : p === bust ? "Bust" : undefined);
    const totals: Record<string, number> = {};
    for (const p of picks) totals[p.player] = (totals[p.player] ?? 0) + p.points;
    const i = rounds.indexOf(phoneRound);

    return (
        <>
            <div className="recap-board" role="table" aria-label="Draft board, by round and player">
                <div className="recap-row recap-head" role="row">
                    <span role="columnheader"><span className="sr-only">Round</span></span>
                    {order.map(o => (
                        <span key={o.user_id} role="columnheader" className="recap-player">{o.user_name} <small>{fmt(totals[o.user_name] ?? 0)}</small></span>
                    ))}
                </div>
                {rounds.map(r => (
                    <div key={r} className="recap-row" role="row">
                        <span role="rowheader" className="recap-round">
                            R{r}
                            <span aria-hidden="true"><Chevron dir={r % 2 ? "right" : "left"} size={10} /></span>
                        </span>
                        {order.map(o => {
                            const p = at(o.user_name, r);
                            return <span key={o.user_id} role="cell">{p && <Cell p={p} tag={tagOf(p)} />}</span>;
                        })}
                    </div>
                ))}
            </div>

            {/* phones: one draft round at a time, in pick order */}
            <div className="recap-phone">
                <div className="bk-round-step recap-step">
                    <button aria-label="Earlier round" disabled={i <= 0} onClick={() => setPhoneRound(rounds[i - 1])}><Chevron dir="left" size={14} /></button>
                    <span className="bk-round-step-label">Round {phoneRound}</span>
                    <button aria-label="Later round" disabled={i >= rounds.length - 1} onClick={() => setPhoneRound(rounds[i + 1])}><Chevron dir="right" size={14} /></button>
                </div>
                <ol className="recap-list">
                    {picks.filter(p => p.round === phoneRound).map(p => (
                        <li key={p.pick} className={`recap-li${p.out ? " out" : ""}${tagOf(p) ? " called" : ""}`}>
                            <span className="recap-li-num">{p.pick}</span>
                            <span className="recap-li-team"><span className="recap-name">{p.team}</span> <small>{p.seed}</small>{tagOf(p) && <em>{tagOf(p)}</em>}</span>
                            <span className="recap-li-who">{p.player}</span>
                            <strong>{p.points > 0 ? fmt(p.points) : "—"}</strong>
                        </li>
                    ))}
                </ol>
            </div>
            <p className="lb-key">Snake order: odd rounds run left to right, even rounds back. Steal and bust compare each pick's points with the average of its draft round. Struck teams are out.</p>
        </>
    );
}

function Ledger({ picks, order, leaderboard, avg, rounds, onBoard }: { picks: RecapPick[]; order: DraftOrderEntry[]; leaderboard: LeaderboardEntry[]; avg: Record<number, number>; rounds: number[]; onBoard: () => void }) {
    const steals = picks.slice(0, 5);
    const busts = [...picks].sort((a, b) => a.value - b.value || a.pick - b.pick).slice(0, 5);
    const table = (title: string, list: RecapPick[], note: string) => (
        <section className="recap-ledger-col">
            <h2 className="gm-col-head">{title} <small>{note}</small></h2>
            <ol className="recap-ledger-list">
                {list.map(p => (
                    <li key={p.pick} className={p.out ? "out" : undefined}>
                        <span className="recap-team"><span className="recap-name">{p.team}</span><small>{p.player} · pick {p.pick} · {p.seed} seed{p.out ? ` · out ${outLabel(p.outRound ?? 2)}` : ""}</small></span>
                        <span className="recap-pts">{p.points > 0 ? fmt(p.points) : "—"}</span>
                        <span className="recap-val">{signed(p.value)}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
    const players = order.map(o => {
        const mine = picks.filter(p => p.player === o.user_name);
        const total = leaderboard.find(e => e.user_name === o.user_name)?.total_points ?? 0;
        return { name: o.user_name, total, best: mine[0], worst: mine[mine.length - 1], value: mine.reduce((s, p) => s + p.value, 0) };
    }).sort((a, b) => b.value - a.value);

    return (
        <>
            <div className="recap-ledger">
                {table("Steals", steals, `top 5 of ${picks.length}`)}
                {table("Busts", busts, `bottom 5 of ${picks.length}`)}
            </div>
            <section className="recap-players">
                <h2 className="gm-col-head">Draft value by player <small>points vs. each round's average, summed</small></h2>
                <div className="recap-players-table" role="table" aria-label="Draft value by player">
                    <div className="recap-prow label" role="row">
                        <span role="columnheader">Player</span><span role="columnheader" className="r">Pts</span>
                        <span role="columnheader">Best pick</span><span role="columnheader">Worst pick</span><span role="columnheader" className="r">Value</span>
                    </div>
                    {players.map(p => (
                        <div key={p.name} className="recap-prow" role="row">
                            <span role="cell" className="recap-pname">{p.name}</span>
                            <span role="cell" className="r recap-ptotal">{fmt(p.total)}</span>
                            <span role="cell">{p.best && <>{p.best.team} <small>#{p.best.pick} {signed(p.best.value)}</small></>}</span>
                            <span role="cell">{p.worst && <>{p.worst.team} <small>#{p.worst.pick} {signed(p.worst.value)}</small></>}</span>
                            <span role="cell" className="r recap-pval">{signed(p.value)}</span>
                        </div>
                    ))}
                </div>
            </section>
            <p className="lb-key">
                Round averages: {rounds.map(r => `R${r} ${fmt(avg[r])}`).join(" · ")}.{" "}
                <button className="link-btn" onClick={onBoard}>Full pick order</button>
            </p>
        </>
    );
}
