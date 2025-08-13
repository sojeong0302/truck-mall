// store/useAuthStore.ts
import { create } from "zustand";

type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
    setToken: (t: string | null) => void;
    logout: () => void;
    hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoggedIn: false,
    setToken: (t) => set({ token: t, isLoggedIn: !!t }),
    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, isLoggedIn: false });
    },
    hydrate: () => {
        const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        set({ token: t, isLoggedIn: !!t });
    },
}));
