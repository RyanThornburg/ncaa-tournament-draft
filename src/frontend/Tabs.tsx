interface TabsProps {
    tab: string;
    setTab: (tab: string) => void;
    tabs: readonly (readonly [string, string])[];
}

export default function Tabs({ tab, setTab, tabs }: TabsProps) {
    return (
        <nav className="tabs-container">
            <div className="tabs" role="tablist">
                {tabs.map(([key, label]) => (
                    <button
                        key={key}
                        role="tab"
                        aria-selected={tab === key}
                        className={`tab${tab === key ? " active" : ""}`}
                        onClick={() => setTab(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    )
}
