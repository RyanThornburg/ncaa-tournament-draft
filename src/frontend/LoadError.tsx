// One way to say a load failed: what didn't load, what happens next, and a way to retry now.
// The technical detail stays in the tooltip for whoever maintains the site.
export default function LoadError({ what, detail, stale, polls, onRetry }: { what: string; detail?: string | null; stale?: boolean; polls?: boolean; onRetry?: () => void }) {
    return (
        <div className="error-banner" role="alert" title={detail ?? undefined}>
            {stale
                ? `Couldn't refresh ${what}. Showing what loaded last${polls ? "; it will try again in 2 minutes" : ""}.`
                : `Couldn't load ${what}.${polls ? " It will try again in 2 minutes." : ""}`}
            {onRetry && <> <button className="link-btn error-retry" onClick={onRetry}>Try again</button></>}
        </div>
    );
}
