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

    const toggleAuth = useCallback(() => {
        if (isLoggedIn) {
            clear();
            delete axios.defaults.headers.common.Authorization;
            // localStorage.removeItem("token"); // (만약 어딘가에서 따로 저장했다면 같이 지우기)
        }
        // 로그인 버튼 클릭 시 라우팅은 Header 컴포넌트에서 처리
    }, [isLoggedIn, clear]);

    return { isLoggedIn, toggleAuth, isHydrated };
};
