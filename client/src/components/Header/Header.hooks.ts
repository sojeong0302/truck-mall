"use client";
import { useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const useAuthToggle = () => {
    const token = useAuthStore((s) => s.token);
    const isHydrated = useAuthStore((s) => s.isHydrated);
    const clear = useAuthStore((s) => s.clear);

    // ✅ 하이드레이션 끝나면 axios 헤더에 토큰 반영
    useEffect(() => {
        if (!isHydrated) return;
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    }, [isHydrated, token]);

    // ✅ 로그인 여부는 token 유무로 파생
    const isLoggedIn = useMemo(() => !!token, [token]);

    const toggleAuth = () => {
        if (!isLoggedIn) return;
        clear();
        try {
            localStorage.removeItem("access_token"); // ✅ 중요
            localStorage.removeItem("token"); // ✅ 예전 키도 같이 삭제
        } catch {}
        delete axios.defaults.headers.common.Authorization;
    };

    return { isLoggedIn, toggleAuth, isHydrated };
};
