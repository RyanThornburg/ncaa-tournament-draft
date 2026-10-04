import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { HISTORICAL_DATA, HISTORICAL_NOTES } from "../config";
import { Chevron, SortArrows } from "./Icons";
import RosterLine from "./RosterLine";

interface HistoryPick {
    team_name: string;
    seed: number;
    pick_order: number;
    points: number;
    eliminated: 0 | 1;
}

interface HistoryScore {
    rank: number;
    user_id: string;
    user_name: string;
    total_points: number;
    picks: HistoryPick[];
}

interface Season {
    year: number;
    notes: string | null;
}

interface YearData {
    season: Season;
    scores: HistoryScore[];
}

type SortCol = "year" | "winner" | "winner_score" | "loser" | "loser_score";
type SortDir = "asc" | "desc";

interface DisplayRow {
    year: number;
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
    scores: HistoryScore[];
    expandable: boolean;
}

export default function History() {
    const [yearData, setYearData] = useState<Record<number, YearData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedYear, setExpandedYear] = useState<number | null>(null);
    const [sortCol, setSortCol] = useState<SortCol>("year");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { seasons } = await api.getHistory() as { seasons: Season[] };
            if (seasons.length > 0) {
                const results = await Promise.all(seasons.map(s => api.getHistoryYear(s.year) as Promise<YearData>));
                const map: Record<number, YearData> = {};
                for (const yd of results) map[yd.season.year] = yd;
                setYearData(map);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    function toggleYear(year: number) {
        setExpandedYear(prev => prev === year ? null : year);
    }

    function handleSort(col: SortCol) {
        if (sortCol === col) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir(col === "year" ? "desc" : "asc");
        }
    }

    if (loading) return <div className="spinner">Loading…</div>;
    if (error) return <div className="error-banner">{error}</div>;

    const allYears = Object.values(yearData);
    if (allYears.length === 0) return <div className="spinner">No historical data yet.</div>;

    const rows: DisplayRow[] = allYears.map(yd => {
        const sorted = [...yd.scores].sort((a, b) => a.rank - b.rank);
        const winner = sorted[0];
        const loser = sorted[sorted.length - 1];
        return {
            year: yd.season.year,
            winner: winner.user_name,
            winnerScore: winner.total_points,
            loser: loser !== winner ? loser.user_name : "???",
            loserScore: loser !== winner ? loser.total_points : 0,
            scores: sorted,
            expandable: true
        };
    });

    // add historical rows not from db
    const historicalRows: DisplayRow[] = Object.entries(HISTORICAL_DATA).map(([year, data]) => {
        const sorted = [...data.scores].sort((a, b) => a.rank - b.rank);
        return {
            year: Number(year),
            winner: sorted[0].user_name,
            winnerScore: sorted[0].total_points as number,
            loser: sorted[sorted.length-1].user_name,
            loserScore: sorted[sorted.length-1].total_points as number,
            scores: [],
            expandable: false,
        };
    });

    const allRows = [...rows, ...historicalRows];

    const sorted = [...allRows].sort((a, b) => {
        let cmp = 0;
        if (sortCol === "year") cmp = a.year - b.year;
        else if (sortCol === "winner") cmp = a.winner.localeCompare(b.winner);
        else if (sortCol === "winner_score") cmp = a.winnerScore - b.winnerScore;
        else if (sortCol === "loser") cmp = a.loser.localeCompare(b.loser);
        else if (sortCol === "loser_score") cmp = a.loserScore - b.loserScore;
        return sortDir === "asc" ? cmp : -cmp;
    });

    function SortIndicator({ col }: { col: SortCol }) {
        if (sortCol !== col) return <span className="hist-sort-icon"><SortArrows /></span>;
        return <span className="hist-sort-icon active"><Chevron dir={sortDir === "asc" ? "up" : "down"} size={10} /></span>;
    }

    const header = (col: SortCol, label: string, score = false) => (
        <button
            className={`hist-th sortable${score ? " score" : ""}${sortCol === col ? " sorted" : ""}`}
            onClick={() => handleSort(col)}
        >
            {score && <SortIndicator col={col} />}{label}{!score && <SortIndicator col={col} />}
        </button>
    );

    return (
        <div>
            <h2 className="section-head">Past winners</h2>
            <div className="hist-table-wrap">
                <div className="hist-table">
                    <div className="hist-thead">
                        {header("year", "Year")}
                        {header("winner", "Winner")}
                        {header("winner_score", "Score", true)}
                        {header("loser", "Low")}
                        {header("loser_score", "Score", true)}
                        <span />
                    </div>

                    {sorted.map(row => {
                        const isExpanded = expandedYear === row.year;
                        return (
                            <div key={row.year}>
                                <button
                                    className={`hist-tr${isExpanded ? " expanded" : ""}${row.expandable ? "" : " static"}`}
                                    onClick={() => row.expandable && toggleYear(row.year)}
                                    aria-expanded={row.expandable ? isExpanded : undefined}
                                >
                                    <span className="hist-td year">{row.year}</span>
                                    <span className="hist-td winner"><span>{row.winner}</span></span>
                                    <span className="hist-td score">{row.winnerScore}</span>
                                    <span className="hist-td muted">{row.loser}</span>
                                    <span className="hist-td score muted">{row.loser !== "-" ? row.loserScore : "-"}</span>
                                    <span className="hist-row-chevron">{row.expandable && <Chevron dir={isExpanded ? "up" : "down"} size={10} />}</span>
                                </button>

                                {isExpanded && (
                                    <div className="hist-detail">
                                        <div className="roster-grid">
                                            {row.scores.map(user => (
                                                <div key={user.user_id} className="roster-card">
                                                    <div className="roster-card-header">
                                                        <div className="roster-name">{user.rank}. {user.user_name}</div>
                                                        <div className="roster-total">{user.total_points}</div>
                                                    </div>
                                                    {[...user.picks].sort((a, b) => a.pick_order - b.pick_order).map(pick => (
                                                        <RosterLine
                                                            key={pick.team_name}
                                                            seed={pick.seed}
                                                            teamName={pick.team_name}
                                                            points={pick.points}
                                                            eliminated={!!pick.eliminated}
                                                        />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {historicalRows.length > 0 && (<div className="hist-historical-label">* Accuracy unconfirmed - data is missing and alleged.</div>)}
                    {HISTORICAL_NOTES && (<div className="hist-historical-notes">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
                            <rect x="1" y="1" width="10" height="10" /><path d="M6 5.5v3M6 3.2v.1" /></svg>
                            {HISTORICAL_NOTES}</div>)}
                </div>
            </div>
        </div>
    );
}
