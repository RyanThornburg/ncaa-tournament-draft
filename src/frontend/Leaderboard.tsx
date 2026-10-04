import { useCallback, useEffect, useState } from "react";
import { Game, LeaderboardEntry } from "../types";
import { ROUND_POINTS, SEASON_YEAR } from "../config";
import { api } from "./api";
import LiveLine from "./LiveLine";
import RosterLine, { LiveScore } from "./RosterLine";
import { championshipDecided, lastSync, maxRemaining, winValue } from "./tournament";
import Updated from "./Updated";
import { Chevron } from "./Icons";

// competition ranking: tied totals share a rank (1, T2, T2, 4)
function rankOf(entries: LeaderboardEntry[], total: number) {
    return 1 + entries.filter(e => e.total_points > total).length;
}

export default function Leaderboard({ me, onChangeMe }: { me: string; onChangeMe: () => void }) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
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
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
        const interval = setInterval(load, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [load]);

    // open the reader's own roster by default
    useEffect(() => {
        const mine = leaderboard.find(e => e.user_name === me);
        if (mine) setExpandedIds(prev => prev.size ? prev : new Set([mine.user_id]));
    }, [leaderboard, me]);

    function toggleExpand(id: string) {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    if (loading) return <div className="spinner">Loading…</div>;

    const owners: Record<string, string> = {};
    for (const e of leaderboard) for (const p of e.picks) owners[p.team_id] = e.user_name;
    // live score per team, from that team's point of view
    const liveByTeam = new Map<string, LiveScore>();
    const names: Record<string, string> = {};
    for (const e of leaderboard) for (const p of e.picks) names[p.team_id] = p.team_name;
    for (const g of games) {
        if (g.game_status !== "live" || !g.team_1_id || !g.team_2_id) continue;
        const gn = g as typeof g & { team_1_name?: string; team_2_name?: string };
        liveByTeam.set(g.team_1_id, { mine: g.team_1_score ?? 0, theirs: g.team_2_score ?? 0, opponent: gn.team_2_name ?? names[g.team_2_id] ?? "", winValue: winValue(g, g.team_1_id) });
        liveByTeam.set(g.team_2_id, { mine: g.team_2_score ?? 0, theirs: g.team_1_score ?? 0, opponent: gn.team_1_name ?? names[g.team_1_id] ?? "", winValue: winValue(g, g.team_2_id) });
    }
    const decided = championshipDecided(games);
    const champs = leaderboard.filter(e => rankOf(leaderboard, e.total_points) === 1 && e.total_points > 0);
    const runnerUp = leaderboard.find(e => !champs.includes(e));

    return (
        <div className="standings">
            {error && <div className="error-banner">Couldn't refresh standings ({error}). Showing the last scores loaded; it will retry in 2 minutes.</div>}
            <LiveLine games={games} owners={owners} me={me} />
            {decided && champs.length > 0 && (
                <div className="pool-champion">
                    <h2 className="pool-champion-name">
                        {champs.map(c => c.user_name).join(" & ")} {champs.length > 1 ? "share" : "wins"} the {SEASON_YEAR} pool
                    </h2>
                    <p className="pool-champion-line">
                        {champs[0].total_points} points{runnerUp ? `, ${champs[0].total_points - runnerUp.total_points} ahead of ${runnerUp.user_name}` : ""}. The Ledgesheet could never.
                    </p>
                </div>
            )}
            <div className="section-row">
                <h2 className="section-head">{decided ? "Final standings" : "Standings"}</h2>
                <Updated at={lastSync(games)} refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
            </div>
            {leaderboard.length > 0 ? (
                <div className={`leaderboard${decided ? " final" : ""}`}>
                    <div className="lb-head label">
                        <span />
                        <span>Player</span>
                        <span className="r">Alive</span>
                        {!decided && <span className="r" title="Most points still possible">Max</span>}
                        <span className="r">Pts</span>
                    </div>
                    {leaderboard.map(({ user_id, user_name, total_points, picks, teams_alive }) => {
                        const isExpanded = expandedIds.has(user_id);
                        const rank = rankOf(leaderboard, total_points);
                        const tied = leaderboard.filter(e => e.total_points === total_points).length > 1;
                        const isLeader = rank === 1 && total_points > 0;
                        const isMe = user_name === me;
                        const playing = picks.filter(p => liveByTeam.has(p.team_id)).length;
                        const max = total_points + maxRemaining(games, owners, user_name);
                        const sortedPicks = [...picks].sort((a, b) => {
                            if (a.eliminated !== b.eliminated) return a.eliminated - b.eliminated;
                            return a.pick_order - b.pick_order;
                        });
                        return (
                            <div key={user_id}>
                                <button
                                    className={`lb-row${isLeader ? " leader" : ""}`}
                                    onClick={() => toggleExpand(user_id)}
                                    aria-expanded={isExpanded}
                                >
                                    <span className="lb-rank">{tied ? `T${rank}` : rank}</span>
                                    <span>
                                        <span className="lb-name">
                                            {user_name}
                                            {isMe && <span className="you-tag">You</span>}
                                            {playing > 0 && <span className="live-tag">Live</span>}
                                            <span className="lb-chevron"><Chevron dir={isExpanded ? "up" : "down"} size={10} /></span>
                                        </span>
                                        <span className="lb-teams-text" aria-hidden="true">
                                            {sortedPicks.map(({ team_name, eliminated, points_earned }, i) => (
                                                <span key={team_name}>
                                                    <span className={eliminated ? "lb-team-out" : undefined}>{team_name}</span> ({points_earned})
                                                    {i !== sortedPicks.length - 1 ? " · " : ""}
                                                </span>
                                            ))}
                                        </span>
                                    </span>
                                    <span className="lb-alive"><span className="sr-only">teams alive </span>{teams_alive}/{picks.length}</span>
                                    {!decided && <span className="lb-max"><span className="sr-only">most possible </span>{max}</span>}
                                    <span className="lb-score"><span className="sr-only">points </span>{total_points}</span>
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
                                                live={liveByTeam.get(pick.team_id) ?? null}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <p className="lb-key">
                        Each win scores {ROUND_POINTS.slice(2).join(" / ")} by round (R64 to final), plus half the seed difference when a lower seed wins. Max is points banked plus every round your surviving teams could still win (not counting upset bonuses).
                        {me && <> <button className="link-btn" onClick={onChangeMe}>{me === "-" ? "Pick your name" : `Not ${me}? Change`}</button></>}
                    </p>
                </div>
            ) : (
                <div className="empty-note">Standings start once the draft is finished.</div>
            )}
        </div>
    );
}
