import { useEffect, useState } from "react";
import { api } from "./api";

interface AdminState {
    isAdmin: boolean;
    email: string | null;
    loading: boolean;
}

// cache admin state so we're only returning one 401 for non users
export function useAdmin(): AdminState {
    const [state, setState] = useState<AdminState>(()=>{
        const cached = sessionStorage.getItem("admin_state");
        if (cached) {
            const parsed = JSON.parse(cached);
            return { ...parsed, loading: false };
        }
        return { isAdmin: false, email: null, loading: true };
    });

    useEffect(() => {
        if (sessionStorage.getItem("admin_state")) return;

        api.getMe()
            .then((data: { email: string; isAdmin: boolean }) => {
                const next = { isAdmin: true, email: data.email, loading: false };
                sessionStorage.setItem("admin_state", JSON.stringify(next));
                setState(next);
            })
            .catch(() => {
                setState({ isAdmin: false, email: null, loading: false });
            })
        }, []);

    return state;
}
