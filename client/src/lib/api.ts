// src/lib/api.ts
import axios, { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({ baseURL: BASE_URL }); // 공개용
export const authApi = axios.create({ baseURL: BASE_URL }); // 보호용

let redirecting = false;

// ---------- 보호용 요청 인터셉터 ----------
authApi.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (!token) {
        // 보호 API에서만 취소
        return Promise.reject(new axios.Cancel("No/Expired token"));
    }

    // ✅ 타입 안전하게 헤더 설정
    if (!config.headers) {
        // 없으면 먼저 비워놓기
        config.headers = new AxiosHeaders();
    }
    if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
    } else {
        // Raw 객체 형태인 경우
        (config.headers as RawAxiosRequestHeaders)["Authorization"] = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
});

// ---------- 응답 인터셉터(공통) ----------
[api, authApi].forEach((inst) => {
    inst.interceptors.response.use(undefined, (error) => {
        // 취소는 리다이렉트 금지
        if (axios.isCancel?.(error) || error?.name === "CanceledError") {
            return Promise.reject(error);
        }
        if (error.response?.status === 401 && !redirecting) {
            redirecting = true;
            const here = window.location.pathname + window.location.search;
            if (!location.pathname.startsWith("/LoginPage")) {
                location.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            }
        }
        return Promise.reject(error);
    });
});
