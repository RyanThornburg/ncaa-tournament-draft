import { useCallback, useEffect, useState } from "react";
import { LeaderboardEntry } from "../types";
import { api } from "./api";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const load = useCallback(async ()=> {
        setLoading(true);
        setError(null);
        try {
            const [l] = await Promise.all([api.getLeaderboard()]);
            setLeaderboard(l);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const interval = setInterval(load, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [load]);

    function toggleExpand(id: string) {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <div>
            {error && <div className="error-banner">{error}</div>}
            {loading ? (
                <div className="spinner">Loading…</div>
            ) : leaderboard.length > 0 ? (
                <div className="leaderboard">
                    {leaderboard.map(({ user_id, user_name, total_points, picks, teams_alive }, idx) => {
                        const isExpanded = expandedIds.has(user_id);
                        const sortedPicks = [...picks].sort((a, b) => {
                            if (a.eliminated !== b.eliminated) return a.eliminated - b.eliminated;
                            return a.pick_order - b.pick_order;
                        });
                        return (
                            <div key={user_id}>
                                <div
                                    className={`lb-row${idx === 0 ? " rank-1" : ""}`}
                                    onClick={() => toggleExpand(user_id)}
                                >
                                    <div className={`lb-rank${idx === 0 ? " gold" : ""}`}>{idx + 1}</div>
                                    <div>
                                        <div className="lb-name">
                                            {user_name}
                                            <span className="lb-chevron">{isExpanded ? " ▲" : " ▼"}</span>
                                        </div>
                                        <div className="lb-teams-text">
                                            {sortedPicks.map(({ team_name, eliminated, points_earned }, i) => (
                                                <span key={team_name} className={`lb-teams-text-${eliminated ? "eliminated" : ""}`}>
                                                    <span>{team_name}</span>
                                                    <span> ({points_earned}) </span>
                                                    <span>{i !== picks.length - 1 ? " · " : ""}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="lb-alive">
                                        <div><span className="alive-dot" />{teams_alive} alive</div>
                                        <div style={{ marginTop: 3 }}><span className="dead-dot" />{picks.length - teams_alive} out</div>
                                    </div>
                                    <div className="lb-score">{total_points}</div>
                                </div>
                                {isExpanded && (
                                    <div className="lb-expand">
                                        {sortedPicks.map(pick => (
                                            <div key={pick.team_name} className={`lb-expand-team${pick.eliminated ? " eliminated" : ""}`}>
                                                <span className="lb-expand-seed">{pick.seed}</span>
                                                <span className="lb-expand-name">{pick.team_name}</span>
                                                <span className="lb-expand-out">{pick.eliminated ? "OUT" : ""}</span>
                                                <span className="lb-expand-pts">+{pick.points_earned}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>Please finish draft</div>
            )}
        </div>
    );
}
