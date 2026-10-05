import { useEffect, useRef, useState } from "react";
import { User } from "../types";
import { api } from "./api";
import { Chevron, Grip } from "./Icons";

interface Props {
    users: User[];
    current?: string[]; // user ids in the saved order, if there is one
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

// Opens on the saved order (a swap on draft night is two arrow taps, not a rebuild); only Randomize shuffles.
function startingOrder(users: User[], current: string[] = []): User[] {
    const placed = current.map(id => users.find(u => u.id === id)).filter((u): u is User => !!u);
    return [...placed, ...users.filter(u => !current.includes(u.id))];
}

export default function DraftOrderEditor({ users, current, onSave, onCancel }: Props) {
    const [order, setOrder] = useState<User[]>(() => startingOrder(users, current));
    const dialogRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);

    // a real dialog: focus moves in, Esc closes, Tab stays inside, focus goes back to the opener
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        headRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { e.preventDefault(); onCancel(); return; }
            if (e.key !== "Tab" || !dialogRef.current) return;
            const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), [tabindex='-1']")];
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            if (opener?.isConnected) opener.focus();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
            <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="deo-title">
                <h2 id="deo-title" ref={headRef} tabIndex={-1}>Set draft order</h2>
                {error && <div className="error-banner" role="alert" title={error} style={{ marginBottom: 16 }}>Couldn't save the order. Try again.</div>}
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
