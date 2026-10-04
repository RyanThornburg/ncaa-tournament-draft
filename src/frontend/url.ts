// Shareable state lives in the query string (?tab=bracket&view=path&player=Dana), replaced in place
export function urlParam(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

export function setUrlParams(params: Record<string, string | null>) {
    const url = new URL(window.location.href);
    for (const [k, v] of Object.entries(params)) {
        if (v) url.searchParams.set(k, v);
        else url.searchParams.delete(k);
    }
    window.history.replaceState(null, "", url);
}
