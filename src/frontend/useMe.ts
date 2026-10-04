import { useCallback, useState } from "react";

const KEY = "theeeeoplex_me";

// Which player is reading, remembered per device. "" = not chosen, "-" = just looking.
export function useMe(): [string, (name: string) => void] {
    const [me, setMeState] = useState<string>(() => {
        try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
    });
    const setMe = useCallback((name: string) => {
        setMeState(name);
        try { localStorage.setItem(KEY, name); } catch { /* private mode: keep for this visit only */ }
    }, []);
    return [me, setMe];
}

export const isPlayer = (me: string) => me !== "" && me !== "-";
