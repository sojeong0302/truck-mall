import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    isLoggedIn: boolean;
    token: string | null;
    login: (token?: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            token: null,
            login: (token) => set({ isLoggedIn: true, token: token ?? null }),
            logout: () => set({ isLoggedIn: false, token: null }),
        }),
        { name: "auth" } // localStorage key
    )
);
