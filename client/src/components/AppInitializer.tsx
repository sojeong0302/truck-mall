"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosHeaders, isAxiosError } from "axios"; // ✅ AxiosHeaders 임포트
import { useAuthStore } from "@/store/useAuthStore";
import { getValidToken, clearToken } from "@/utils/token";

export default function AppInitializer() {
    const setToken = useAuthStore((s) => s.setToken);
    const router = useRouter();

    useEffect(() => {
        // 최초 동기화 (만료면 null)
        setToken(getValidToken());

        // 요청 인터셉터
        const reqId = axios.interceptors.request.use((config) => {
            const t = getValidToken();
            if (!t) {
                setToken(null);
                if (typeof window !== "undefined") {
                    const here = window.location.pathname + window.location.search;
                    router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
                }
                return Promise.reject(new axios.Cancel("No/Expired token"));
            }

            // ✅ 헤더 인스턴스를 보장하고 .set()으로 추가
            const headers = (config.headers ??= new AxiosHeaders());
            (headers as AxiosHeaders).set("Authorization", `Bearer ${t}`);
            return config;
        });

        // 응답 인터셉터
        const resId = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (isAxiosError(err) && err.response?.status === 401 && typeof window !== "undefined") {
                    clearToken();
                    setToken(null);
                    const here = window.location.pathname + window.location.search;
                    router.replace(`/LoginPage?expired=1&next=${encodeURIComponent(here)}`);
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
