"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
    token: string | null;
    isHydrated: boolean; // ✅ 로컬스토리지 로드 완료 여부
    setToken: (t: string) => void;
    clear: () => void;
    setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            isHydrated: false,
            setToken: (t) => set({ token: t }),
            clear: () => set({ token: null }),
            setHydrated: (v) => set({ isHydrated: v }),
        }),
        {
            name: "auth",
            partialize: (s) => ({ token: s.token }), // ✅ token만 저장
            onRehydrateStorage: () => () => {
                // ✅ 하이드레이션 완료 신호
                useAuthStore.getState().setHydrated(true);
            },
        }
    )
);
