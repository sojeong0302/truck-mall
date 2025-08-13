// store/useAuthStore.ts
import { create } from "zustand";

type AuthState = {
    token: string | null;
    isLoggedIn: boolean;
    isHydrated: boolean; // ✅ 추가
    setToken: (t: string | null) => void;
    logout: () => void;
    clear: () => void; // ✅ 추가 (logout 별칭)
    hydrate: () => void; // ✅ 추가 (localStorage → store)
};

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoggedIn: false,
    isHydrated: false, // ✅ 초기값

    setToken: (t) => set({ token: t, isLoggedIn: !!t }),

    logout: () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
        } catch {}
        set({ token: null, isLoggedIn: false });
    },

    clear: () => {
        // ✅ Header.hooks.ts 호환용
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
        } catch {}
        set({ token: null, isLoggedIn: false });
    },

    hydrate: () => {
        // ✅ 하이드레이션: 토큰 로드 + 플래그 on
        const t =
            typeof window !== "undefined"
                ? localStorage.getItem("token") || localStorage.getItem("access_token")
                : null;

        set({
            token: t,
            isLoggedIn: !!t,
            isHydrated: true,
        });
    },
}));
