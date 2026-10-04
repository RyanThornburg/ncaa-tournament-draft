import { useState } from "react";
import { User } from "../types";
import { api } from "./api";
import { Chevron, Grip } from "./Icons";

interface Props {
    users: User[];
    onSave: () => void;
    onCancel: () => void;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function DraftOrderEditor({ users, onSave, onCancel }: Props) {
    const [order, setOrder] = useState<User[]>(() => shuffle(users));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);


    function move(from: number, to: number) {
        const next = [...order];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        setOrder(next);
    }

    function handleDragStart(i: number) {
        setDragIndex(i);
    }

    function handleDragOver(e: React.DragEvent, i: number) {
        e.preventDefault();
        setDragOverIndex(i);
    }

    function handleDrop(i: number) {
        if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
        setDragIndex(null);
        setDragOverIndex(null);
    }

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            await api.setDraftOrder(order.map(u => u.id));
            onSave();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deo-title">
                <h2 id="deo-title">Set draft order</h2>
                {error && <div className="error-banner" style={{ marginBottom: 16 }}>{error}</div>}
                <p className="admin-card-meta" style={{ marginBottom: 12 }}>
                    Drag to reorder, or use the arrows. Pick 1 goes first.
                </p>
                <div className="deo-list">
                    {order.map((user, i) => (
                        <div
                            key={user.id}
                            className={`deo-row${dragOverIndex === i && dragIndex !== i ? " deo-over" : ""}`}
                            draggable
                            onDragStart={() => handleDragStart(i)}
                            onDragOver={e => handleDragOver(e, i)}
                            onDrop={() => handleDrop(i)}
                            onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                        >
                            <span className="deo-handle"><Grip /></span>
                            <span className="deo-num">{i + 1}</span>
                            <span className="deo-name">{user.display_name}</span>
                            <div className="deo-arrows">
                                <button
                                    className="deo-arrow"
                                    disabled={i === 0}
                                    onClick={() => move(i, i - 1)}
                                    title="Move up"
                                    aria-label={`Move ${user.display_name} up`}
                                ><Chevron dir="up" /></button>
                                <button
                                    className="deo-arrow"
                                    disabled={i === order.length - 1}
                                    onClick={() => move(i, i + 1)}
                                    title="Move down"
                                    aria-label={`Move ${user.display_name} down`}
                                ><Chevron dir="down" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-btns">
                    <button className="btn-cancel" onClick={() => setOrder(shuffle(users))}>
                        Randomize
                    </button>
                    <div style={{ flex: 1 }} />
                    <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn-confirm" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : "Save order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
