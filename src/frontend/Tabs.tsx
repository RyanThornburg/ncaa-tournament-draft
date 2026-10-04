import { useEffect, useRef } from "react";

interface TabsProps {
    tab: string;
    setTab: (tab: string) => void;
    tabs: readonly (readonly [string, string])[];
    live?: string[];
}

export default function Tabs({ tab, setTab, tabs, live = [] }: TabsProps) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    // keep the active tab in view when the row scrolls on narrow phones
    const i = tabs.findIndex(([key]) => key === tab);
    useEffect(() => {
        const el = refs.current[i];
        const row = el?.parentElement;
        if (!el || !row) return;
        // scroll the tab row only (never the page)
        if (el.offsetLeft < row.scrollLeft) row.scrollLeft = el.offsetLeft - 16;
        else if (el.offsetLeft + el.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = el.offsetLeft + el.offsetWidth - row.clientWidth + 16;
    }, [i]);

    // arrow keys move between tabs (WAI-ARIA tabs pattern)
    function onKeyDown(e: React.KeyboardEvent, i: number) {
        const last = tabs.length - 1;
        const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
            : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
            : e.key === "Home" ? 0 : e.key === "End" ? last : null;
        if (next === null) return;
        e.preventDefault();
        setTab(tabs[next][0]);
        refs.current[next]?.focus();
    }

    return (
        <nav className="tabs-container" aria-label="Sections">
            <div className="tabs" role="tablist">
                {tabs.map(([key, label], i) => (
                    <button
                        key={key}
                        ref={el => { refs.current[i] = el; }}
                        id={`tab-${key}`}
                        role="tab"
                        aria-selected={tab === key}
                        aria-controls={`panel-${key}`}
                        tabIndex={tab === key ? 0 : -1}
                        className={`tab${tab === key ? " active" : ""}`}
                        onClick={() => setTab(key)}
                        onKeyDown={e => onKeyDown(e, i)}
                    >
                        {live.includes(key) && <span className="tab-live" aria-hidden="true" />}
                        {label}
                        {live.includes(key) && <span className="sr-only"> (live)</span>}
                    </button>
                ))}
            </div>
        </nav>
    )
}
