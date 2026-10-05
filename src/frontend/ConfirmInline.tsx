import { useEffect, useRef, useState } from "react";

// In-place confirm for destructive actions. The safe button lands where the trigger was (triggers sit
// right-aligned, so Keep goes last) and takes focus; the danger button sits to its left and ignores
// clicks for its first 400ms, so a nervous double-click on the trigger can't fire it.
export default function ConfirmInline({ question, confirmLabel, keepLabel = "Keep", busyLabel, busy, onConfirm, onKeep }: {
    question: string; confirmLabel: string; keepLabel?: string; busyLabel?: string; busy?: boolean;
    onConfirm: () => void; onKeep: () => void;
}) {
    const [armed, setArmed] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const t = setTimeout(() => setArmed(true), 400);
        // when the confirm closes, the trigger comes back in the same spot: hand focus back to it
        // (the last enabled button there) instead of letting it fall to the top of the page
        const home = ref.current?.parentElement ?? null;
        return () => {
            clearTimeout(t);
            const refocus = () => {
                if (!home?.isConnected || (document.activeElement && document.activeElement !== document.body)) return;
                const buttons = home.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
                buttons[buttons.length - 1]?.focus();
            };
            setTimeout(refocus, 0);
            setTimeout(refocus, 400);
        };
    }, []);
    return (
        <div ref={ref} className="confirm-inline" role="group" aria-label={question}>
            <span className="confirm-q">{question}</span>
            <button className="btn-danger" onClick={() => armed && onConfirm()} disabled={busy}>{busy && busyLabel ? busyLabel : confirmLabel}</button>
            <button className="btn-cancel" onClick={onKeep} disabled={busy} autoFocus>{keepLabel}</button>
        </div>
    );
}
