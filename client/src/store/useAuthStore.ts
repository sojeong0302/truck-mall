import { create } from "zustand";

interface AuthState {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    login: () => set({ isLoggedIn: true }),
    logout: () => {
        localStorage.removeItem("token"); // 로그아웃 시 토큰 제거
        set({ isLoggedIn: false });
    },
}));
