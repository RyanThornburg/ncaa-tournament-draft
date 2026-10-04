import { useEffect, useState } from "react";
import { User } from "../types";
import { api } from "./api";
import { SEASON_YEAR, TOURNAMENT_HEAD, TOURNAMENT_SUBHEAD } from "../config";

interface EditState {
    name: string;
    displayName: string;
    email: string;
}

interface Season {
    header?: string;
    subheader?: string;
}

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<string | null>(null); // holds user id being saved, or "new"

    const [editId, setEditId] = useState<string | null>(null);
    const [editState, setEditState] = useState<EditState>({ name: "", displayName: "", email: "" });

    const [showCreate, setShowCreate] = useState(false);
    const [newUser, setNewUser] = useState<EditState>({ name: "", displayName: "", email: "" });

    const [archiveConfirm, setArchiveConfirm] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [deactivateId, setDeactivateId] = useState<string | null>(null);

    async function resetDraft() {
        setResetting(true);
        try {
            await api.deletePicks();
            setResetConfirm(false);
            setError(null);
        } catch (e) {
            setError(`Couldn't reset the draft (${e instanceof Error ? e.message : String(e)}).`);
        } finally {
            setResetting(false);
        }
    }
    const [archiving, setArchiving] = useState(false);

    async function archiveSeason() {
        setArchiving(true);
        try {
            const notes: Season = {
                header: TOURNAMENT_HEAD ? TOURNAMENT_HEAD : '',
                subheader: TOURNAMENT_SUBHEAD ? TOURNAMENT_SUBHEAD : ''
            }
            await api.archiveSeason(SEASON_YEAR, JSON.stringify(notes));
            setArchiveConfirm(false);
            setError(null);
            alert(`Season ${SEASON_YEAR} archived successfully.`);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setArchiveConfirm(false);
        } finally {
            setArchiving(false);
        }
    }

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const u = await api.getUsers(false); // all users including inactive
            setUsers(u);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function startEdit(user: User) {
        setEditId(user.id);
        setEditState({
            name: user.user_name,
            displayName: user.display_name,
            email: user.email ?? "",
        });
    }

    async function saveEdit(id: string) {
        setSaving(id);
        try {
            await api.updateUser(id, {
                name: editState.name,
                displayName: editState.displayName,
                email: editState.email || undefined,
            });
            setEditId(null);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(null);
        }
    }

    async function toggleActive(user: User) {
        setSaving(user.id);
        try {
            await api.updateUser(user.id, { active: !user.active });
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(null);
        }
    }

    async function createUser() {
        if (!newUser.name.trim()) return;
        setSaving("new");
        try {
            await api.createUser(newUser.name.trim(), newUser.displayName.trim() || undefined, newUser.email.trim() || undefined);
            setNewUser({ name: "", displayName: "", email: "" });
            setShowCreate(false);
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(null);
        }
    }

    if (loading) return <div className="spinner">Loading…</div>;

    return (
        <div className="admin">
            {error && <div className="error-banner">{error}</div>}

            <div className="admin-bar">
                <h2>Users</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-confirm" onClick={() => setShowCreate(true)}>Add user</button>
                    <button className="btn-cancel" onClick={() => { window.location.href = "/cdn-cgi/access/logout"; }}>Logout</button>
                </div>
            </div>

            {showCreate && (
                <div className="admin-card">
                    <div className="admin-field-row">
                        <input
                            className="admin-input"
                            placeholder="Username (slug)"
                            value={newUser.name}
                            onChange={e => setNewUser(s => ({ ...s, name: e.target.value }))}
                        />
                        <input
                            className="admin-input"
                            placeholder="Display name"
                            value={newUser.displayName}
                            onChange={e => setNewUser(s => ({ ...s, displayName: e.target.value }))}
                        />
                        <input
                            className="admin-input"
                            placeholder="Email (optional)"
                            value={newUser.email}
                            onChange={e => setNewUser(s => ({ ...s, email: e.target.value }))}
                        />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button className="btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
                        <button className="btn-confirm" onClick={createUser} disabled={saving === "new" || !newUser.name.trim()}>
                            {saving === "new" ? "Saving…" : "Create"}
                        </button>
                    </div>
                </div>
            )}

            <div className="admin-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <div className="admin-card-name">Reset draft</div>
                        <div className="admin-card-meta">Delete every pick for {SEASON_YEAR}. The draft order is kept. This can't be undone.</div>
                    </div>
                    {resetConfirm ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="admin-card-meta">Delete all picks?</span>
                            <button className="btn-cancel" onClick={() => setResetConfirm(false)}>Keep picks</button>
                            <button className="btn-danger" onClick={resetDraft} disabled={resetting}>
                                {resetting ? "Deleting…" : "Delete all picks"}
                            </button>
                        </div>
                    ) : (
                        <button className="btn-cancel" onClick={() => setResetConfirm(true)}>Reset draft</button>
                    )}
                </div>
            </div>

            <div className="admin-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <div className="admin-card-name">Archive season {SEASON_YEAR}</div>
                        <div className="admin-card-meta">Seal the current season so it appears in historical results</div>
                    </div>
                    {archiveConfirm ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="admin-card-meta">Are you sure?</span>
                            <button className="btn-cancel" onClick={() => setArchiveConfirm(false)}>Cancel</button>
                            <button className="btn-danger" onClick={archiveSeason} disabled={archiving}>
                                {archiving ? "Archiving…" : "Confirm"}
                            </button>
                        </div>
                    ) : (
                        <button className="btn-cancel" onClick={() => setArchiveConfirm(true)}>Archive season</button>
                    )}
                </div>
            </div>

            <div>
                {users.map(user => (
                    <div key={user.id} className={`admin-card${user.active ? "" : " admin-card-inactive"}`}>
                        {editId === user.id ? (
                            <>
                                <div className="admin-field-row">
                                    <div className="admin-input static">{user.user_name}</div>
                                    <input
                                        className="admin-input"
                                        value={editState.displayName}
                                        onChange={e => setEditState(s => ({ ...s, displayName: e.target.value }))}
                                        placeholder="Display name"
                                    />
                                    <input
                                        className="admin-input"
                                        value={editState.email}
                                        onChange={e => setEditState(s => ({ ...s, email: e.target.value }))}
                                        placeholder="Email"
                                    />
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                    <button className="btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
                                    <button className="btn-confirm" onClick={() => saveEdit(user.id)} disabled={saving === user.id}>
                                        {saving === user.id ? "Saving…" : "Save"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div className="admin-card-name">{user.display_name}</div>
                                    <div className="admin-card-meta">
                                        {[user.user_name !== user.display_name ? user.user_name : "", user.email ?? ""].filter(Boolean).join(" · ")}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    {!user.active && (
                                        <span className="label">Inactive</span>
                                    )}
                                    <button className="btn-cancel" onClick={() => startEdit(user)}>Edit</button>
                                    {deactivateId === user.id ? (
                                        <>
                                            <span className="admin-card-meta">Deactivate {user.display_name}?</span>
                                            <button className="btn-cancel" onClick={() => setDeactivateId(null)} autoFocus>Keep</button>
                                            <button className="btn-danger" onClick={() => { setDeactivateId(null); toggleActive(user); }} disabled={saving === user.id}>Deactivate</button>
                                        </>
                                    ) : (
                                        <button
                                            className={user.active ? "btn-cancel" : "btn-confirm"}
                                            onClick={() => user.active ? setDeactivateId(user.id) : toggleActive(user)}
                                            disabled={saving === user.id}
                                        >
                                            {saving === user.id ? "Saving…" : user.active ? "Deactivate" : "Activate"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
