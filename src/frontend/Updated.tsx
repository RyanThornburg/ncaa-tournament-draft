import { useEffect, useState } from "react";

// "Updated 2 min ago" for data that refreshes on a timer
export default function Updated({ at }: { at: number | null }) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 30 * 1000);
        return () => clearInterval(t);
    }, []);
    if (!at) return null;
    const mins = Math.floor((now - at) / 60000);
    return <span className="updated">Updated {mins < 1 ? "just now" : `${mins} min ago`}</span>;
}
