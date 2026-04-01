import { useState } from "react";

interface TabsProps {
    tab: string;
    setTab: (tab: string) => void;
    tabs: readonly (readonly [string, string])[];
}

export default function Tabs({ tab, setTab, tabs }: TabsProps) {
    const [open, setOpen] = useState(false);
    const activeLabel = tabs.find(([key]) => key === tab)?.[1] ?? "";

    return (
        <div className="tabs-container">
            <button className="tabs-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
                <span className="tabs-hamburger-label">{activeLabel}</span>
                <span className="tabs-hamburger-icon">{open ? "✕" : "☰"}</span>
            </button>
            <div className={`tabs${open ? " tabs-open" : ""}`}>
                {tabs.map(([key, label]) => (
                    <button key={key} className={`tab${tab === key ? " active" : ""}`} onClick={() => { setTab(key); setOpen(false); }}>
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
