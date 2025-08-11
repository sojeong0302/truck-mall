"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthToggle = () => {
    const { isLoggedIn, login, logout } = useAuthStore();

    // ✅ 새로고침 시 localStorage 토큰으로 로그인 상태 복원
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token && !isLoggedIn) login(token as any); // login이 토큰 인자를 받지 않으면 인자 제거
    }, [isLoggedIn, login]);

    const toggleAuth = () => {
        if (isLoggedIn) {
            logout();
            localStorage.removeItem("token"); // ✅ 토큰도 정리
        } else {
            // 로그인 페이지로 이동은 헤더 index.tsx에서 처리 중
        }
    };

    return { isLoggedIn, toggleAuth };
};
