import { useCallback, useEffect, useRef, useState } from 'react';
import { DraftOrderEntry, Team, User, Pick, LeaderboardEntry } from '../types';
import { api } from './api';
import DraftOrderEditor from './DraftOrderEditor';
import RosterLine from './RosterLine';
import LoadError from './LoadError';

export default function Draft({ teams, users, isAdmin = false, regionOrder }: { teams: Team[], users: User[], isAdmin?: boolean, regionOrder?: (regions: string[]) => string[] }){
    const [draftOrder, setDraftOrder] = useState<DraftOrderEntry[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    
    const [picks, setPicks] = useState<Pick[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showOrderEditor, setShowOrderEditor] = useState(false);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [confirmUndo, setConfirmUndo] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLButtonElement>(null);
    const maxRounds = Math.floor(teams.length / users.length);

    const load = useCallback(async (showLoading = true)=> {
        if (showLoading) setLoading(true);
        setError(null);
        setLoadError(null);
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
            }
            setDraftOrder(order);
            setPicks(p);
            setLeaderboard(l);
        } catch (e) {
            setLoadError(e instanceof Error ? e.message : String(e));
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
    const allRegions = [...new Set(teams.map(t => t.region))].sort();
    const regions = regionOrder ? regionOrder(allRegions) : allRegions;
    const lastPicked = picks.length ? picks[picks.length - 1] : undefined;

    // mapping teams/users
    const ownerMap: Record<string, string> = {};
    const ownerNameMap: Record<string, string> = {};
    picks.forEach(p=> {
        ownerMap[p.team_id] = p.user_id;
        ownerNameMap[p.team_id] = p.user_name;
    });

    const pendingTeam = pendingId ? teams.find(t => t.id === pendingId) ?? null : null;
    const q = query.trim().toLowerCase();
    const matches = (t: Team) => !q || t.name.toLowerCase().includes(q);
    const firstMatch = q ? teams.filter(t => !draftedTeamIds.has(t.id) && matches(t)).sort((a, b) => a.overall_rank - b.overall_rank)[0] : undefined;

    // a pick is two steps on a shared screen: choose, then confirm
    function choose(teamId: string) {
        if (!isAdmin || !currentDraftUser || isDraftDone || saving || draftedTeamIds.has(teamId)) return;
        setPendingId(teamId);
    }

    async function confirmPick() {
        if (!pendingId || !currentDrafterId || saving) return;
        setSaving(true);
        try {
            await api.postPicks(currentDrafterId, pendingId, draftIndex + 1);
            setPendingId(null);
            setQuery("");
            await load(false);
            searchRef.current?.focus();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg.includes("mismatch")) {
                await load(false);
                setError("Another pick landed first, so the board has been refreshed. Check whose turn it is and pick again.");
            } else {
                setError(`That pick didn't save (${msg}). Try again.`);
            }
            setPendingId(null);
        } finally {
            setSaving(false);
        }
    }

    // a pending pick puts focus on Confirm, so Enter confirms and Tab reaches Cancel; Enter on any
    // other focused control does that control's job and never commits the pick
    useEffect(() => {
        if (pendingId) confirmRef.current?.focus();
    }, [pendingId]);

    useEffect(() => {
        if (!pendingId) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { e.preventDefault(); setPendingId(null); searchRef.current?.focus(); }
            const idle = !document.activeElement || document.activeElement === document.body;
            if (e.key === "Enter" && idle) { e.preventDefault(); confirmPick(); }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    async function handleResetLastPick() {
        if (picks.length === 0 || saving) return;
        setConfirmUndo(false);
        setSaving(true);
        try {
            const lastPick = picks[picks.length - 1];
            await api.deleteLastPick(lastPick.pick_order);
            await load(false);
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg.includes("mismatch")) {
                await load(false);
                setError("The board changed before the undo went through, so it has been refreshed. Check the last pick and try again.");
            } else {
                setError(`Couldn't undo the last pick (${msg}).`);
            }
        } finally {
            setSaving(false);
        }
    }

    const lastLine = lastPicked ? `Pick ${lastPicked.pick_order}: ${lastPicked.user_name} takes ${lastPicked.team_name}` : "";
    const noMatch = !!q && !firstMatch;

    // snake turns: the same drafter picks twice in a row at the end of each round
    const pickedLast = draftIndex > 0 && DRAFT_ORDER[draftIndex - 1] === currentDrafterId;
    const picksNext = DRAFT_ORDER[draftIndex + 1] === currentDrafterId;
    const turnNote = pickedLast ? "picks again at the turn" : picksNext ? "has the next two picks" : "";

    // undo is destructive and public, so it confirms in place like Reset does
    const undoControl = lastPicked && (confirmUndo ? (
        <div className="draft-undo-confirm" role="group" aria-label="Confirm undo">
            <span>Undo pick {lastPicked.pick_order} ({lastPicked.user_name}, {lastPicked.team_name})?</span>
            <button className="btn-cancel" onClick={() => setConfirmUndo(false)} disabled={saving} autoFocus>Keep</button>
            <button className="btn-danger" onClick={handleResetLastPick} disabled={saving}>Undo it</button>
        </div>
    ) : (
        <button className="btn-cancel" onClick={() => setConfirmUndo(true)} disabled={saving}>Undo last pick</button>
    ));

    return (
        <>
        {showOrderEditor && (
            <DraftOrderEditor
                users={users}
                onSave={() => { setShowOrderEditor(false); load(); }}
                onCancel={() => setShowOrderEditor(false)}
            />
        )}
        {error && <div className="error-banner" role="alert">{error}</div>}
        {loadError && <LoadError what="the draft board" detail={loadError} stale={picks.length > 0} onRetry={() => load()} />}
        <div className="sr-only" aria-live="polite">{lastLine}</div>
        {loading ? (
            <div className="spinner">Loading…</div>
        ) : loadError && draftOrder.length === 0 ? null : (
        <div>
            {isDraftDone ? (
                <div className="draft-complete">
                    <div>
                        <h2>Draft complete</h2>
                        {lastPicked && <p className="draft-last">Last pick: {lastPicked.user_name} took {lastPicked.team_name}</p>}
                    </div>
                    {isAdmin && lastPicked && (
                        <div className="draft-actions">
                            {undoControl}
                        </div>
                    )}
                </div>
            ) : (
                <div className="draft-header">
                    <div className="draft-clock">
                        {pendingTeam ? (
                            <>
                                <div className="draft-turn">{currentDraftUser?.display_name} takes <em>{pendingTeam.name}?</em></div>
                                <div className="draft-confirm">
                                    <button ref={confirmRef} className="btn-confirm" onClick={confirmPick} disabled={saving}>{saving ? "Saving…" : "Confirm pick"}</button>
                                    <button className="btn-cancel" onClick={() => { setPendingId(null); searchRef.current?.focus(); }} disabled={saving}>Cancel</button>
                                    <span className="draft-count">Enter to confirm · Esc to cancel</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="draft-turn">On the clock: <em>{currentDraftUser?.display_name}</em></div>
                                <span className="draft-count">
                                    Pick {draftIndex + 1} of {teams.length} · {teams.length - draftIndex} remaining
                                    {turnNote && <> · <strong className="draft-turn-note">{currentDraftUser?.display_name} {turnNote}</strong></>}
                                </span>
                            </>
                        )}
                    </div>
                    {lastPicked && !pendingTeam && (
                        <p className="draft-last"><span className="draft-last-num">{lastPicked.pick_order}</span> {lastPicked.user_name} takes {lastPicked.team_name}</p>
                    )}
                    <div className="draft-tools">
                        {isAdmin && (
                            <input
                                ref={searchRef}
                                className="admin-input draft-search"
                                type="search"
                                placeholder="Find a team…"
                                aria-label="Find a team to pick"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && firstMatch) { e.preventDefault(); choose(firstMatch.id); }
                                    if (e.key === "Escape") setQuery("");
                                }}
                                aria-describedby={noMatch ? "draft-nomatch" : undefined}
                            />
                        )}
                        {isAdmin && noMatch && (
                            <p className="draft-nomatch" id="draft-nomatch" role="status">No undrafted team matches “{query.trim()}”.</p>
                        )}
                        <div className="draft-meta">
                            <span className="label">Best available, by overall rank</span>
                            <div className="draft-meta-row">
                            {teams
                                .filter(t => !(draftedTeamIds.has(t.id)))
                                .sort((a, b) => a.overall_rank - b.overall_rank)
                                .slice(0, 3)
                                .map(team => (
                                    <button
                                        key={team.id}
                                        className="team-btn inline"
                                        onClick={() => choose(team.id)}
                                        disabled={!isAdmin || saving}
                                    >
                                        <span className="seed-badge rank" title="Overall rank">#{team.overall_rank}</span>
                                        <span className="team-name">{team.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {isAdmin && (
                            <div className="draft-actions">
                                {picks.length > 0 ? undoControl : (
                                    <button className="btn-confirm" onClick={() => setShowOrderEditor(true)}>Set draft order</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!isDraftDone && (
            <>
                <div className="draft-order" aria-label="Upcoming picks">
                    {DRAFT_ORDER.slice(Math.max(0, draftIndex - 2), draftIndex + maxRounds+1).map((uid, i) => {
                        const gi = Math.max(0, draftIndex - 2) + i;
                        const uname = users.find(u => u.id === uid)?.display_name ?? uid;
                        return (
                            <div key={gi} className={`draft-pill${gi === draftIndex ? " current" : ""}${gi < draftIndex ? " done" : ""}`}>
                                {gi + 1}. {uname}
                            </div>
                        );
                    })}
                </div>
                {picks.length > 0 && (
                    <div className="drafter-strip">
                        {draftOrder.map(entry => {
                            const mine = picks.filter(p => p.user_id === entry.user_id);
                            return (
                                <div key={entry.user_id} className={`drafter${entry.user_id === currentDrafterId ? " current" : ""}`}>
                                    <div className="drafter-name">{entry.user_name} <span className="drafter-count">{mine.length}</span></div>
                                    <div className="drafter-teams">{mine.map(p => p.team_name).join(" · ") || "—"}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </>
            )}
            {isDraftDone && picks.length > 0 ? (
            <div className="roster-grid">
                {draftOrder.map(entry => {
                    const user = users.find(u => u.id === entry.user_id);
                    const userPoints = leaderboard.find(l => l.user_id == entry.user_id);
                    if (!userPoints) return null;
                    const userPicks = [...userPoints.picks].sort((a, b) => a.pick_order - b.pick_order);
                    return (
                        <div className="roster-card" key={entry.user_id}>
                            <div className="roster-card-header">
                                <div className="roster-name">{user?.display_name ?? entry.user_name}</div>
                                <div className="roster-total">{userPoints.total_points}</div>
                            </div>
                            {userPicks.map(pick => (
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
                            .filter(t => t.region === region && matches(t))
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
                                    className={`team-btn${isDrafted ? " drafted" : ""}${team.id === pendingId ? " pending" : ""}${team.id === firstMatch?.id ? " match" : ""}`}
                                    disabled={isDrafted || saving || !isAdmin}
                                    onClick={() => choose(team.id)}
                                    >
                                        <span className="seed-badge" title="Seed">{team.seed}</span>
                                        <span className="team-name">{team.name}</span>
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
