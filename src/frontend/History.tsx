import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { HISTORICAL_DATA, HISTORICAL_NOTES } from "../config";

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
        if (sortCol !== col) return <span className="hist-sort-icon">⇅</span>;
        return <span className="hist-sort-icon active">{sortDir === "asc" ? "▲" : "▼"}</span>;
    }

    return (
        <div>
            <div className="hist-table-wrap">
                <div className="hist-table">
                    <div className="hist-thead">
                        <div className="hist-th year sortable" onClick={() => handleSort("year")}>Year <SortIndicator col="year" /></div>
                        <div className="hist-th sortable" onClick={() => handleSort("winner")}>Winner <SortIndicator col="winner" /></div>
                        <div className="hist-th score sortable" onClick={() => handleSort("winner_score")}><SortIndicator col="winner_score" /> Score</div>
                        <div className="hist-th sortable" onClick={() => handleSort("loser")}>Low <SortIndicator col="loser" /></div>
                        <div className="hist-th score sortable" onClick={() => handleSort("loser_score")}><SortIndicator col="loser_score" /> Score</div>
                        <div></div>
                    </div>

                    {sorted.map(row => {
                        const isExpanded = expandedYear === row.year;
                        return (
                            <div key={row.year}>
                                <div 
                                    className={`hist-tr${isExpanded ? " expanded" : ""}`} 
                                    onClick={() => row.expandable && toggleYear(row.year)}
                                    style={row.expandable ? undefined : {cursor: "default"}}
                                >
                                    <div className="hist-td year">{row.year}</div>
                                    <div className="hist-td">{row.winner}</div>
                                    <div className="hist-td score gold">{row.winnerScore}</div>
                                    <div className="hist-td muted">{row.loser}</div>
                                    <div className="hist-td score muted">{row.loser !== "-" ? row.loserScore : "-"}</div>
                                    <div className="hist-row-chevron">{row.expandable ? (isExpanded ? "▲" : "▼") : ""}</div>
                                </div>

                                {isExpanded && (
                                    <div className="hist-detail">
                                        <div className="roster-grid">
                                            {row.scores.map(user => (
                                                <div key={user.user_id} className="roster-card">
                                                    <div className="roster-card-header">
                                                        <div className="roster-name">{user.user_name}</div>
                                                        <div className="roster-pts">{user.total_points} pts</div>
                                                    </div>
                                                    <div className="roster-teams">
                                                        {[...user.picks].sort((a, b) => a.pick_order - b.pick_order).map(pick => (
                                                            <div key={pick.team_name} className={`roster-team ${pick.eliminated ? "eliminated" : "won"}`}>
                                                                <span style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: 18 }}>{pick.seed}</span>
                                                                <span>{pick.team_name}</span>
                                                                <span className="team-out">{pick.eliminated ? "OUT" : ""}</span>
                                                                <span className="team-pts">+{pick.points}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {historicalRows && (<div className="hist-historical-label">* Accuracy unconfirmed - data is missing and alleged.</div>)}
                    {HISTORICAL_NOTES && (<div className="hist-historical-notes">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",verticalAlign:"middle",marginRight:"4px",marginBottom:"2px"}}>
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            {HISTORICAL_NOTES}</div>)}
                </div>
                
                </div>
                

        </div>
    );
}
