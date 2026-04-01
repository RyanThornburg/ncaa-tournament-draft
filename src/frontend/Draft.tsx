import { useCallback, useEffect, useState } from 'react';
import { DraftOrderEntry, Team, User, Pick, LeaderboardEntry } from '../types';
import { api } from './api';
import DraftOrderEditor from './DraftOrderEditor';

export default function Draft({ teams, users, isAdmin = false }: { teams: Team[], users: User[], isAdmin?: boolean }){
    const [draftOrder, setDraftOrder] = useState<DraftOrderEntry[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    
    const [picks, setPicks] = useState<Pick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showOrderEditor, setShowOrderEditor] = useState(false);
    const maxRounds = Math.floor(teams.length / users.length);

    const load = useCallback(async (showLoading = true)=> {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const [d, p, l] = await Promise.all([
                api.getDraftOrder(),
                api.getPicks(),
                api.getLeaderboard()
            ]);
            let order = d.order;
            if (order.length === 0) {
                const randomized = await api.setDraftOrderRandom();
                order = randomized.order;
                console.log('Random Draft:', order)
            }
            setDraftOrder(order);
            setPicks(p);
            setLeaderboard(l);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    function buildDraftOrder(users: {id: string; name: string}[]): string[]{
        const order: string[] = [];

        for (let round = 0; round < maxRounds; round++) {
            const ids = users.map(u => u.id);
            order.push(...(round % 2 === 0 ? ids : ids.reverse()));
        }
        return order;
    }

    const DRAFT_ORDER = buildDraftOrder(draftOrder.map(d=>({id: d.user_id, name: d.user_name})));
    const draftIndex = picks.length;
    const currentDrafterId = DRAFT_ORDER[draftIndex] ?? null;
    const currentDraftUser = users.find(u => u.id === currentDrafterId) ?? null;
    const isDraftDone = picks && draftIndex >= teams.length;
    const draftedTeamIds = new Set(picks.map(p=> p.team_id));
    const regions = [...new Set(teams.map(t => t.region))].sort();
    const lastPicked = picks.length ? picks[picks.length - 1] : undefined;

    // mapping teams/users
    const ownerMap: Record<string, string> = {};
    const ownerNameMap: Record<string, string> = {};
    picks.forEach(p=> {
        ownerMap[p.team_id] = p.user_id;
        ownerNameMap[p.team_id] = p.user_name;
    });

    async function handlePick(teamId: string) {
        if (!isAdmin || !currentDraftUser || isDraftDone || saving) return;
        setSaving(true);
        try {
            await api.postPicks(currentDrafterId, teamId, draftIndex + 1);
            await load(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(false);
        }
    }

    async function handleResetLastPick() {
        if (picks.length === 0 || saving) return;
        setSaving(true);
        try {
            const lastPick = picks[picks.length - 1];
            await api.deleteLastPick(lastPick.pick_order);
            await load(false);
        } catch (e) {
            if (e instanceof Error && e.message.includes("mismatch")) {
               await load(false); // refresh stale state
            }
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(false);
        }
    }

    async function handleResetDraft() {
        if (!confirm("Reset the entire draft? This cannot be undone")) return;
        try {
            await api.deletePicks();
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }

    return (
        <>
        {showOrderEditor && (
            <DraftOrderEditor
                users={users}
                onSave={() => { setShowOrderEditor(false); load(); }}
                onCancel={() => setShowOrderEditor(false)}
            />
        )}
        {error && <div className="error-banner">{error}</div>}
        {loading ? (
            <div className="spinner">Loading…</div>
        ) : (
        <div>
            {isDraftDone ? (
                <div className="draft-complete">

                    <div>
                        <h3>Draft Complete!</h3>
                        {isAdmin && (<div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "center", flexWrap: "wrap" }}>
                            {lastPicked && <button className="btn-cancel" onClick={handleResetLastPick} disabled={saving}>Undo Last Pick</button>}
                            <button className="btn-danger" onClick={handleResetDraft}>Reset Draft</button>
                        </div>)}
                    </div>

                </div>
            ):(
                <div className="draft-header">
                    <div>
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                            Pick {draftIndex + 1} of {users.length * 8}
                        </div>
                        <div className="draft-turn">🏀 {currentDraftUser?.display_name}'s Pick{saving ? " (saving…)" : ""}</div>
                    </div>
                    <div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Best Available</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {teams
                            .filter(t => !(draftedTeamIds.has(t.id)))
                            .sort((a, b) => a.overall_rank - b.overall_rank)
                            .slice(0, 3)
                            .map((team, i) => (
                                <button
                                    key={team.id}
                                    className="team-btn"
                                    style={{ width: "auto", paddingBlock: 0, alignItems: "center" }}
                                    onClick={() => handlePick(team.id)}
                                    
                                >
                                    <span className={`seed-badge s${i+1}`}> {team.overall_rank} </span>
                                    <span>{team.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {lastPicked && <div className="last-picked-section">

                        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Last Picked</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span className="team-btn" >
                            <span >{lastPicked.team_name}</span>
                            <span className="team-owner">{lastPicked.user_name}</span>
                        </span>
                        </div>
                    </div>}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
                        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{(users.length * 8) - draftIndex} remaining</span>
                        {isAdmin && (picks.length > 0 ? (
                        <>
                            <button className="btn-cancel" onClick={handleResetLastPick}>Undo Last Pick</button>
                            <button className="btn-danger" onClick={handleResetDraft}>Reset Draft</button>
                        </>
                        ) : (
                            <button className="btn-confirm" onClick={() => setShowOrderEditor(true)}>Set Draft Order</button>
                        ))}
                    </div>
                </div>
            )}
            {!isDraftDone && (
            <div className="draft-order">
                {DRAFT_ORDER.slice(Math.max(0, draftIndex - 2), draftIndex + maxRounds+1).map((uid, i) => {
                    const gi = Math.max(0, draftIndex - 2) + i;
                    const uname = users.find(u => u.id === uid)?.display_name ?? uid;
                    return (
                        <div key={gi} className={`draft-pill${gi === draftIndex ? " current" : ""}${gi < draftIndex ? " done" : ""}`}>
                            {gi + 1}. {uname}
                        </div>
                    );
                })}
            </div>)}
            {isDraftDone && picks.length > 0 ? (
            <div className="roster-grid">
                {draftOrder.map(entry => {
                    const user = users.find(u => u.id === entry.user_id);
                    const userPoints = leaderboard
                        .filter(l=> l.user_id == entry.user_id)[0]
                    const userPicks = userPoints.picks.sort((a, b) => a.pick_order - b.pick_order);
                    return (
                        <div className="roster-card" key={entry.user_id}>
                            <div className="roster-card-header">
                                <div className="roster-name">{user?.display_name ?? entry.user_name}</div>
                                <div className="roster-pts">{userPoints.total_points} pts</div>
                            </div>
                            <div className="roster-teams">

                                {userPicks.map(pick => {
                                    const cls = pick.eliminated ? "eliminated" : "active";
                                    return (
                                    <div key={pick.team_id} className={`roster-team ${cls}`}>
                                        <span style={{ fontSize: "0.72rem", color: "var(--muted)", minWidth: 18 }}>{pick.seed}</span>
                                        <span>{pick.team_name}</span>
                                        <span className="team-out">{pick.eliminated ? "OUT" : ""}</span>
                                        <span className="team-pts">+{pick.points_earned}</span>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            ) : (
            <div className="region-grid">
                {regions.map(region => (
                    <div className="region-card" key={region}>
                        <div className="region-title">{region}</div>
                        <div className="team-list">
                        {teams
                            .filter(t => t.region === region)
                            .sort((a, b) => {
                                const aDrafted = draftedTeamIds.has(a.id) ? 1 : 0;
                                const bDrafted = draftedTeamIds.has(b.id) ? 1 : 0;
                                if (aDrafted !== bDrafted) return aDrafted - bDrafted;
                                return a.seed - b.seed;})
                            .map(team => {
                                const isDrafted = draftedTeamIds.has(team.id);
                                const owner = ownerNameMap[team.id];
                                return (
                                    <button
                                    key={team.id}
                                    className={`team-btn${isDrafted ? " drafted" : ""}`}
                                    disabled={isDrafted || saving}
                                    onClick={() => handlePick(team.id)}
                                    >
                                        <span className={`seed-badge${team.seed <= 4 ? ` s${team.seed}` : ""}`}>{team.seed}</span>
                                        <span>{team.name}</span>
                                        {owner && <span className="team-owner">{owner}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            )}
            
        </div>
        )}
    </>
    )
}