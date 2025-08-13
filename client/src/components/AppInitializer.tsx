"use client";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AppInitializer() {
    const hydrate = useAuthStore((s) => s.hydrate); // ✅ hydrate 사용
    const token = useAuthStore((s) => s.token); // ✅ 토큰 변경 감지
    const router = useRouter();

    // 1) 첫 마운트 시 스토어 하이드레이트
    useEffect(() => {
        hydrate();
    }, [hydrate]);

    // 2) 토큰이 바뀔 때 axios 헤더 동기화
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    }, [token]);

    // 3) 401 공통 처리 (옵션: 사용 중이면 유지)
    useEffect(() => {
        const id = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err?.response?.status === 401 && typeof window !== "undefined") {
                    try {
                        localStorage.removeItem("token");
                        localStorage.removeItem("access_token");
                    } catch {}
                    const here = window.location.pathname + window.location.search;
                    router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
                }
                return Promise.reject(err);
            }
        );
        return () => axios.interceptors.response.eject(id);
    }, [router]);

    return null;
}
