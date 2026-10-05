// History led by people instead of years: titles, lows, best and average finish for each player,
// with the reader's own record on top. Built from the archived finishing orders plus the
// pre-site rows (which only know a winner, and sometimes a low), so averages count known finishes only.

export interface RecordSeason {
    year: number;
    // finishing order as known; pre-site years know only the ends (winner, sometimes the low)
    finishes: { name: string; rank: number; low?: boolean; alleged?: boolean }[];
    complete: boolean;
}

interface Row {
    name: string;
    titles: { year: number; alleged: boolean }[];
    lows: number[];
    ranks: number[];
}

const short = (y: number) => `'${String(y).slice(-2)}`;
const fmt = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
const ordinal = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"}`;

export default function RecordBook({ seasons, me }: { seasons: RecordSeason[]; me: string }) {
    const rows = new Map<string, Row>();
    const row = (name: string) => {
        if (!rows.has(name)) rows.set(name, { name, titles: [], lows: [], ranks: [] });
        return rows.get(name)!;
    };
    for (const s of [...seasons].sort((a, b) => a.year - b.year)) {
        for (const f of s.finishes) {
            if (!f.name || f.name === "???") continue;
            const r = row(f.name);
            r.ranks.push(f.rank);
            if (f.rank === 1) r.titles.push({ year: s.year, alleged: !!f.alleged });
            if (f.low) r.lows.push(s.year);
        }
    }
    const list = [...rows.values()].sort((a, b) =>
        b.titles.length - a.titles.length
        || avg(a.ranks) - avg(b.ranks)
        || a.name.localeCompare(b.name));
    if (list.length === 0) return null;

    const mine = rows.get(me);
    const partial = seasons.filter(s => !s.complete).map(s => s.year).sort();

    return (
        <section className="rb" aria-labelledby="rb-head">
            {mine && (
                <p className="rb-you">
                    <span className="label">Your history</span>
                    <strong>
                        {me}: {mine.titles.length} title{mine.titles.length === 1 ? "" : "s"}
                        {mine.titles.length > 0 && ` (${mine.titles.map(t => t.year).join(", ")})`}
                        {" · "}{mine.lows.length} low{mine.lows.length === 1 ? "" : "s"}
                        {mine.ranks.length > 0 && ` · avg finish ${fmt(avg(mine.ranks))}`}
                    </strong>
                </p>
            )}
            <div className="section-row">
                <h2 className="section-head" id="rb-head">Record book</h2>
                <span className="yg-count">{seasons.length} seasons on file</span>
            </div>
            <div className="rb-table" role="table" aria-label="Record book, by player">
                <div className="rb-row label" role="row">
                    <span role="columnheader">Player</span>
                    <span role="columnheader">Titles</span>
                    <span role="columnheader">Lows</span>
                    <span role="columnheader" className="rb-best">Best</span>
                    <span role="columnheader" className="r">Avg finish</span>
                    <span role="columnheader" className="r rb-seasons">Seasons</span>
                </div>
                {list.map(r => {
                    const best = r.ranks.length ? Math.min(...r.ranks) : null;
                    const isMe = r.name === me;
                    return (
                        <div key={r.name} className="rb-row" role="row">
                            <span role="cell" className="rb-name">
                                {r.name}{isMe && <span className="you-tag">You</span>}
                                <small>{best ? `Best ${ordinal(best)} · ` : ""}{r.ranks.length} season{r.ranks.length === 1 ? "" : "s"}</small>
                            </span>
                            <span role="cell" className="rb-count">
                                {r.titles.length ? <>{r.titles.length}{r.titles.map(t => (
                                    <span key={t.year} className={`rb-year${isMe ? " mine" : ""}`}>{short(t.year)}{t.alleged ? "*" : ""}</span>
                                ))}</> : <span className="rb-none">—</span>}
                            </span>
                            <span role="cell" className="rb-count">
                                {r.lows.length ? <>{r.lows.length}{r.lows.map(y => <span key={y} className="rb-year low">{short(y)}</span>)}</> : <span className="rb-none">—</span>}
                            </span>
                            <span role="cell" className="rb-best">{best ? ordinal(best) : "—"}</span>
                            <span role="cell" className="r rb-avg">{r.ranks.length ? fmt(avg(r.ranks)) : "—"}</span>
                            <span role="cell" className="r rb-seasons">{r.ranks.length}</span>
                        </div>
                    );
                })}
            </div>
            <p className="lb-key">
                Averages count only seasons with a known finish.
                {partial.length > 0 && ` ${partial.join(" and ")} ${partial.length === 1 ? "counts" : "count"} only for the finishers on record.`}
            </p>
        </section>
    );
}

function avg(xs: number[]) {
    return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 99;
}
