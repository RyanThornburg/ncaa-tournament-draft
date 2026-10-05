import { useEffect, useState } from "react";
import { User } from "../types";
import { api } from "./api";
import { SEASON_YEAR, TOURNAMENT_HEAD, TOURNAMENT_SUBHEAD } from "../config";
import ConfirmInline from "./ConfirmInline";

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
    const [error, setErrorState] = useState<{ msg: string; detail?: string } | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const setError = (msg: string | null, e?: unknown) =>
        setErrorState(msg ? { msg, detail: e === undefined ? undefined : e instanceof Error ? e.message : String(e) } : null);
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
            setError("Couldn't reset the draft. Try again.", e);
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
            setNotice(`${SEASON_YEAR} is archived. Its standings now live in History.`);
        } catch (e) {
            setError(`Couldn't archive ${SEASON_YEAR}. Try again.`, e);
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
            setError("Couldn't load players.", e);
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
            setError("Couldn't save that player. Try again.", e);
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
            setError(`Couldn't ${user.active ? "deactivate" : "activate"} ${user.display_name}. Try again.`, e);
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
            setError("Couldn't add that player. Try again.", e);
        } finally {
            setSaving(null);
        }
    }

    if (loading) return <div className="spinner">Loading…</div>;

    const field = (id: string, label: string, value: string, onChange: (v: string) => void, opts: { type?: string; placeholder?: string } = {}) => (
        <label className="admin-field" htmlFor={id}>
            <span className="label">{label}</span>
            <input id={id} className="admin-input" type={opts.type ?? "text"} placeholder={opts.placeholder} value={value} onChange={e => onChange(e.target.value)} />
        </label>
    );

    return (
        <div className="admin">
            {error && <div className="error-banner" role="alert" title={error.detail}>{error.msg}</div>}
            {notice && <p className="admin-notice" role="status">{notice}</p>}

            <section className="admin-section" aria-labelledby="admin-season">
                <h2 className="admin-head" id="admin-season">Season {SEASON_YEAR}</h2>
                <div className="admin-card admin-row">
                    <div>
                        <div className="admin-card-name">Reset draft</div>
                        <div className="admin-card-meta">Delete every pick for {SEASON_YEAR}. The draft order is kept. This can't be undone.</div>
                    </div>
                    {resetConfirm ? (
                        <ConfirmInline question="Delete all picks?" confirmLabel="Delete all picks" keepLabel="Keep picks" busyLabel="Deleting…" busy={resetting}
                            onConfirm={resetDraft} onKeep={() => setResetConfirm(false)} />
                    ) : (
                        <button className="btn-cancel" onClick={() => setResetConfirm(true)}>Reset draft</button>
                    )}
                </div>
                <div className="admin-card admin-row">
                    <div>
                        <div className="admin-card-name">Archive {SEASON_YEAR}</div>
                        <div className="admin-card-meta">Freeze this season's standings into History. Do this after the final.</div>
                    </div>
                    {archiveConfirm ? (
                        <ConfirmInline question={`Archive ${SEASON_YEAR}? Standings freeze into History.`} confirmLabel={`Archive ${SEASON_YEAR}`} busyLabel="Archiving…" busy={archiving}
                            onConfirm={archiveSeason} onKeep={() => setArchiveConfirm(false)} />
                    ) : (
                        <button className="btn-cancel" onClick={() => setArchiveConfirm(true)}>Archive season</button>
                    )}
                </div>
            </section>

            <section className="admin-section" aria-labelledby="admin-players">
                <div className="admin-bar">
                    <h2 className="admin-head" id="admin-players">Players</h2>
                    <div className="admin-actions">
                        <button className="btn-confirm" onClick={() => setShowCreate(true)}>Add player</button>
                        <button className="btn-cancel" onClick={() => { window.location.href = "/cdn-cgi/access/logout"; }}>Log out</button>
                    </div>
                </div>

                {showCreate && (
                    <div className="admin-card">
                        <div className="admin-field-row">
                            {field("new-name", "Username", newUser.name, v => setNewUser(s => ({ ...s, name: v })), { placeholder: "lowercase, no spaces" })}
                            {field("new-display", "Display name", newUser.displayName, v => setNewUser(s => ({ ...s, displayName: v })))}
                            {field("new-email", "Email (optional)", newUser.email, v => setNewUser(s => ({ ...s, email: v })), { type: "email" })}
                        </div>
                        <div className="admin-actions admin-form-actions">
                            <button className="btn-cancel" onClick={() => setShowCreate(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={createUser} disabled={saving === "new" || !newUser.name.trim()}>
                                {saving === "new" ? "Saving…" : "Add player"}
                            </button>
                        </div>
                    </div>
                )}

                {users.map(user => (
                    <div key={user.id} className={`admin-card${user.active ? "" : " admin-card-inactive"}`}>
                        {editId === user.id ? (
                            <>
                                <div className="admin-field-row">
                                    <div className="admin-field">
                                        <span className="label">Username</span>
                                        <div className="admin-input static">{user.user_name}</div>
                                    </div>
                                    {field(`edit-display-${user.id}`, "Display name", editState.displayName, v => setEditState(s => ({ ...s, displayName: v })))}
                                    {field(`edit-email-${user.id}`, "Email", editState.email, v => setEditState(s => ({ ...s, email: v })), { type: "email" })}
                                </div>
                                <div className="admin-actions admin-form-actions">
                                    <button className="btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
                                    <button className="btn-confirm" onClick={() => saveEdit(user.id)} disabled={saving === user.id}>
                                        {saving === user.id ? "Saving…" : "Save"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="admin-row">
                                <div>
                                    <div className="admin-card-name">{user.display_name}</div>
                                    <div className="admin-card-meta">
                                        {[user.user_name !== user.display_name ? user.user_name : "", user.email ?? ""].filter(Boolean).join(" · ")}
                                    </div>
                                </div>
                                <div className="admin-actions">
                                    {!user.active && <span className="label">Inactive</span>}
                                    {deactivateId === user.id ? (
                                        <ConfirmInline question={`Deactivate ${user.display_name}?`} confirmLabel="Deactivate" busy={saving === user.id}
                                            onConfirm={() => { setDeactivateId(null); toggleActive(user); }} onKeep={() => setDeactivateId(null)} />
                                    ) : (
                                        <>
                                            <button className="btn-cancel" onClick={() => startEdit(user)}>Edit</button>
                                            <button
                                                className={user.active ? "btn-cancel" : "btn-confirm"}
                                                onClick={() => user.active ? setDeactivateId(user.id) : toggleActive(user)}
                                                disabled={saving === user.id}
                                            >
                                                {saving === user.id ? "Saving…" : user.active ? "Deactivate" : "Activate"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}
