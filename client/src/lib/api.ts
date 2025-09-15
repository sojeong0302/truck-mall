// src/lib/api.ts
import axios, { AxiosHeaders, RawAxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://saemaeultruck.pics";

/** 공개용 axios 인스턴스 */
export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

/** 보호용 axios 인스턴스 (이제 Authorization 헤더는 사용 안 함: 쿠키+CSRF만) */
export const authApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let redirecting = false;

/* ------------------------- 유틸 ------------------------- */

function setHeader(config: InternalAxiosRequestConfig, key: string, value?: string | null) {
    if (!value) return;
    if (!config.headers) config.headers = new AxiosHeaders();

    if (config.headers instanceof AxiosHeaders) {
        config.headers.set(key, value);
    } else {
        (config.headers as RawAxiosRequestHeaders)[key] = value;
    }
}

/** /auth/refresh 여부 */
function isRefreshRequest(config: InternalAxiosRequestConfig) {
    const url = config.url ?? "";
    return url.includes("/auth/refresh");
}

/** Authorization 헤더가 혹시 들어있다면 제거(혼용 방지) */
function stripAuthorization(config: InternalAxiosRequestConfig) {
    if (!config.headers) return;
    if (config.headers instanceof AxiosHeaders) {
        (config.headers as AxiosHeaders).delete?.("Authorization");
    } else {
        delete (config.headers as RawAxiosRequestHeaders)["Authorization"];
        delete (config.headers as RawAxiosRequestHeaders)["authorization"];
    }
}

/** CSRF 헤더 자동 부착 */
function attachCsrfHeader(config: InternalAxiosRequestConfig) {
    // refresh 요청엔 csrf_refresh_token, 그 외엔 csrf_access_token
    const isRefresh = isRefreshRequest(config);
    const csrf = Cookies.get(isRefresh ? "csrf_refresh_token" : "csrf_access_token");
    if (csrf) setHeader(config, "X-CSRF-TOKEN", csrf);
}

/* --------------------- 요청 인터셉터 --------------------- */
/** 두 인스턴스 공통: 쿠키 포함, Authorization 제거, CSRF 부착 */
[api, authApi].forEach((inst) => {
    inst.interceptors.request.use((config) => {
        config.withCredentials = true;

        // 혼용 이슈 방지: 모든 요청에서 Authorization 제거
        stripAuthorization(config);

        // CSRF 자동 부착
        attachCsrfHeader(config);

        return config;
    });
});

/* --------------------- 응답 인터셉터 --------------------- */
/** 401이면 로그인 페이지로 이동(중복 이동 방지) */
[api, authApi].forEach((inst) => {
    inst.interceptors.response.use(undefined, (error) => {
        // 요청 취소는 무시
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
