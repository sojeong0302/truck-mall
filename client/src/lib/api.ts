// src/lib/api.ts
import axios, { AxiosHeaders, RawAxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://saemaeultruck.pics";

/** 공용 axios 인스턴스 (공개용) */
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ✅ 크로스사이트 쿠키 전송
});

/** 보호용 axios 인스턴스 (인증 필요) */
export const authApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let redirecting = false;

/** 안전하게 헤더를 세팅하는 헬퍼 */
function setHeader(config: InternalAxiosRequestConfig, key: string, value: string | undefined | null) {
    if (!value) return;

    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }
    if (config.headers instanceof AxiosHeaders) {
        config.headers.set(key, value);
    } else {
        (config.headers as RawAxiosRequestHeaders)[key] = value;
    }
}

/** refresh 요청인지 판별 */
function isRefreshRequest(config: InternalAxiosRequestConfig) {
    const url = config.url ?? "";
    // 절대/상대경로 모두 대응
    return url.includes("/auth/refresh");
}

/* -------------------------------------------------------------
 * 요청 인터셉터
 * ----------------------------------------------------------- */

/** 공개/보호 인스턴스 모두: refresh 요청에는 X-CSRF-TOKEN 자동 첨부 */
[api, authApi].forEach((inst) => {
    inst.interceptors.request.use((config) => {
        // 항상 쿠키 포함
        config.withCredentials = true;

        // ✅ /auth/refresh 일 때: CSRF 토큰 헤더 첨부
        if (isRefreshRequest(config)) {
            // Flask-JWT-Extended가 내려주는 비-HttpOnly 쿠키 이름(기본값)
            const csrf = Cookies.get("csrf_refresh_token");
            setHeader(config, "X-CSRF-TOKEN", csrf ?? "");
            // 혹시 이전에 붙은 Authorization이 있다면 제거
            if (config.headers instanceof AxiosHeaders) {
                config.headers.delete?.("Authorization");
            } else if (config.headers) {
                delete (config.headers as RawAxiosRequestHeaders)["Authorization"];
                delete (config.headers as RawAxiosRequestHeaders)["authorization"];
            }
        }

        return config;
    });
});

/** 보호용 전용: Authorization 헤더 자동 첨부(단, refresh는 제외) */
authApi.interceptors.request.use((config) => {
    if (!isRefreshRequest(config)) {
        const token = useAuthStore.getState().token;
        if (!token) {
            // 보호 API에서만 취소
            return Promise.reject(new axios.Cancel("No/Expired token"));
        }
        setHeader(config, "Authorization", `Bearer ${token}`);
    }
    return config;
});

/* -------------------------------------------------------------
 * 응답 인터셉터(공통)
 *  - 취소 에러는 그대로 통과
 *  - 401이면 기존처럼 로그인 페이지로 이동(한 번만)
 * ----------------------------------------------------------- */
[api, authApi].forEach((inst) => {
    inst.interceptors.response.use(undefined, (error) => {
        // 취소는 리다이렉트 금지
        if (axios.isCancel?.(error) || error?.name === "CanceledError") {
            return Promise.reject(error);
        }
        if (error?.response?.status === 401 && !redirecting) {
            redirecting = true;
            const here = window.location.pathname + window.location.search;
            if (!location.pathname.startsWith("/LoginPage")) {
                location.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
            }
        }
        return Promise.reject(error);
    });
});
