"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosHeaders, isAxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { getValidToken, clearToken } from "@/utils/token";

export default function AppInitializer() {
    const setToken = useAuthStore((s) => s.setToken);
    const router = useRouter();

    // 인증 제외(whitelist) 경로들
    const AUTH_FREE_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/verify"];

    const shouldSkipAuth = (url?: string) => {
        if (!url) return false;
        try {
            // 절대/상대 경로 모두 처리
            const base =
                process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? window.location.origin : "");
            const u = new URL(url, base);
            return AUTH_FREE_PATHS.some((p) => u.pathname.startsWith(p));
        } catch {
            // URL 파싱 실패 시 단순 포함 체크
            return AUTH_FREE_PATHS.some((p) => url.startsWith(p) || url.includes(p));
        }
    };

    useEffect(() => {
        // 최초 동기화 (만료면 null)
        setToken(getValidToken());

        // 요청 인터셉터
        const reqId = axios.interceptors.request.use((config) => {
            // ✅ 로그인/회원가입/리프레시 등은 토큰 검사 건너뜀
            if (shouldSkipAuth(config.url)) return config;

            const t = getValidToken();
            if (!t) {
                setToken(null);
                if (typeof window !== "undefined") {
                    const here = window.location.pathname + window.location.search;
                    router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
                }
                return Promise.reject(new axios.Cancel("No/Expired token"));
            }

            // 타입 안전하게 헤더 세팅
            const headers = (config.headers ??= new AxiosHeaders());
            (headers as AxiosHeaders).set("Authorization", `Bearer ${t}`);
            return config;
        });

        // 응답 인터셉터 (백업 방어)
        const resId = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (isAxiosError(err) && err.response?.status === 401 && typeof window !== "undefined") {
                    clearToken();
                    setToken(null);
                    // 로그인 페이지에 이미 있는 경우엔 리디렉트 생략 가능(선택)
                    const onLogin = window.location.pathname.startsWith("/LoginPage");
                    if (!onLogin) {
                        const here = window.location.pathname + window.location.search;
                        router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
                    }
                }
                return Promise.reject(err);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqId);
            axios.interceptors.response.eject(resId);
        };
    }, [router, setToken]);

    return null;
}
