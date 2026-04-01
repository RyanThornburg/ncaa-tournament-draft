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
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
            {error && <div className="error-banner">{error}</div>}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Users</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-confirm" onClick={() => setShowCreate(true)}>+ Add User</button>
                    <button className="btn-cancel" onClick={() => { window.location.href = "/cdn-cgi/access/logout"; }}>Logout</button>
                </div>
            </div>

            {showCreate && (
                <div className="admin-card" style={{ marginBottom: 16 }}>
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

            <div className="admin-card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Archive Season {SEASON_YEAR}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Seal the current season so it appears in historical results</div>
                    </div>
                    {archiveConfirm ? (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Are you sure?</span>
                            <button className="btn-cancel" onClick={() => setArchiveConfirm(false)}>Cancel</button>
                            <button className="btn-danger" onClick={archiveSeason} disabled={archiving}>
                                {archiving ? "Archiving…" : "Confirm"}
                            </button>
                        </div>
                    ) : (
                        <button className="btn-cancel" onClick={() => setArchiveConfirm(true)}>Archive Season</button>
                    )}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {users.map(user => (
                    <div key={user.id} className={`admin-card${user.active ? "" : " admin-card-inactive"}`}>
                        {editId === user.id ? (
                            <>
                                <div className="admin-field-row">
                                    <div className="admin-input" style={{ border: "1px solid var(--navy)", color: "var(--muted)" }}>{user.user_name}</div>
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
                                    <div style={{ fontWeight: 600 }}>{user.display_name}</div>
                                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                                        {user.user_name}{user.email ? ` · ${user.email}` : ""}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    {!user.active && (
                                        <span style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase" }}>Inactive</span>
                                    )}
                                    <button className="btn-cancel" onClick={() => startEdit(user)}>Edit</button>
                                    <button
                                        className={user.active ? "btn-danger" : "btn-confirm"}
                                        onClick={() => toggleActive(user)}
                                        disabled={saving === user.id}
                                    >
                                        {saving === user.id ? "…" : user.active ? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
