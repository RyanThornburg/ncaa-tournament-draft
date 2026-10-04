import { useEffect, useState } from "react";

// "Scores synced 3 min ago · Refresh": `at` is the server's last sync with the NCAA feed
export default function Updated({ at, onRefresh, refreshing }: { at: number | null; onRefresh?: () => void; refreshing?: boolean }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => clearInterval(t);
    }, []);
    const mins = at ? Math.max(0, Math.floor((now - at) / 60000)) : null;
    const age = mins === null ? null
        : mins < 1 ? "just now"
        : mins < 90 ? `${mins} min ago`
        : new Date(at!).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
    return (
        <span className="updated" aria-live="polite">
            {age && <>Scores synced {age}</>}
            {onRefresh && (
                <button className="refresh-btn" onClick={onRefresh} disabled={refreshing}>
                    {refreshing ? "Refreshing…" : "Refresh"}
                </button>
            )}
        </span>
    );
}
