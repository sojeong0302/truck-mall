"use client";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AppInitializer() {
    const setToken = useAuthStore((s) => s.setToken);
    const router = useRouter();

    useEffect(() => {
        // 1) 초기 토큰 주입 (localStorage → store, axios)
        const readToken = () =>
            (typeof window !== "undefined" &&
                (localStorage.getItem("token") || localStorage.getItem("access_token"))) ||
            null;

        const applyToken = (t: string | null) => {
            setToken(t);
            if (t) {
                axios.defaults.headers.common.Authorization = `Bearer ${t}`;
            } else {
                delete axios.defaults.headers.common.Authorization;
            }
        };

        applyToken(readToken());

        // 2) 다른 탭/창에서 로그인/로그아웃 시 동기화
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token" || e.key === "access_token") {
                applyToken(readToken());
            }
        };
        window.addEventListener("storage", onStorage);

        // 3) 401 응답 공통 처리 (만료 시 로그인 페이지로)
        const interceptorId = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                const status = err?.response?.status;
                if (status === 401 && typeof window !== "undefined") {
                    try {
                        localStorage.removeItem("token");
                        localStorage.removeItem("access_token");
                    } catch {}
                    applyToken(null);
                    const here = window.location.pathname + window.location.search;
                    router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
                }
                return Promise.reject(err);
            }
        );

        // 정리
        return () => {
            window.removeEventListener("storage", onStorage);
            axios.interceptors.response.eject(interceptorId);
        };
    }, [setToken, router]);

    return null;
}
