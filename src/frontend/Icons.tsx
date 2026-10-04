// Small stroke icons, drawn to match the 2px rules used across the page.
interface IconProps { size?: number }

export function Chevron({ dir, size = 12 }: IconProps & { dir: "up" | "down" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
            <path d={dir === "up" ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} />
        </svg>
    );
}

export function SortArrows({ size = 10 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M5 0l3 4H2zM5 10L2 6h6z" />
        </svg>
    );
}

export function Grip({ size = 14 }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <rect x="2" y="3" width="10" height="2" /><rect x="2" y="9" width="10" height="2" />
        </svg>
    );
}
