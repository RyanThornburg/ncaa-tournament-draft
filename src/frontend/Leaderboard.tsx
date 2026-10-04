import { useCallback, useEffect, useState } from "react";
import { Game, LeaderboardEntry } from "../types";
import { api } from "./api";
import LiveLine from "./LiveLine";
import RosterLine from "./RosterLine";
import { Chevron } from "./Icons";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const load = useCallback(async ()=> {
        setError(null);
        try {
            const [l, g] = await Promise.all([api.getLeaderboard(), api.getGames()]);
            setLeaderboard(l);
            setGames(g);
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

    if (loading) return <div className="spinner">Loading…</div>;

    return (
        <div className="standings">
            {error && <div className="error-banner">{error}</div>}
            <LiveLine games={games} />
            <h2 className="section-head">Standings</h2>
            {leaderboard.length > 0 ? (
                <div className="leaderboard">
                    <div className="lb-head label">
                        <span />
                        <span>Player</span>
                        <span className="r">Alive</span>
                        <span className="r">Pts</span>
                    </div>
                    {leaderboard.map(({ user_id, user_name, total_points, picks, teams_alive }, idx) => {
                        const isExpanded = expandedIds.has(user_id);
                        const sortedPicks = [...picks].sort((a, b) => {
                            if (a.eliminated !== b.eliminated) return a.eliminated - b.eliminated;
                            return a.pick_order - b.pick_order;
                        });
                        return (
                            <div key={user_id}>
                                <button
                                    className={`lb-row${idx === 0 ? " rank-1" : ""}`}
                                    onClick={() => toggleExpand(user_id)}
                                    aria-expanded={isExpanded}
                                >
                                    <span className="lb-rank">{idx + 1}</span>
                                    <span>
                                        <span className="lb-name">
                                            {user_name}
                                            <span className="lb-chevron"><Chevron dir={isExpanded ? "up" : "down"} size={10} /></span>
                                        </span>
                                        <span className="lb-teams-text">
                                            {sortedPicks.map(({ team_name, eliminated, points_earned }, i) => (
                                                <span key={team_name}>
                                                    <span className={eliminated ? "lb-team-out" : undefined}>{team_name}</span> ({points_earned})
                                                    {i !== sortedPicks.length - 1 ? " · " : ""}
                                                </span>
                                            ))}
                                        </span>
                                    </span>
                                    <span className="lb-alive">{teams_alive}/{picks.length}</span>
                                    <span className="lb-score">{total_points}</span>
                                </button>
                                {isExpanded && (
                                    <div className="lb-expand">
                                        {sortedPicks.map(pick => (
                                            <RosterLine
                                                key={pick.team_id}
                                                seed={pick.seed}
                                                teamName={pick.team_name}
                                                points={pick.points_earned}
                                                eliminated={!!pick.eliminated}
                                                eliminatedRound={pick.eliminated_round}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-note">Standings start once the draft is finished.</div>
            )}
        </div>
    );
}
