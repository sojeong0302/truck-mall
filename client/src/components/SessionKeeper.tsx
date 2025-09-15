"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { readToken, isExpired } from "@/utils/token";
import Cookies from "js-cookie";

type JwtPayload = { exp?: number };
const parseJwt = (t: string): JwtPayload => {
    try {
        return JSON.parse(atob(t.split(".")[1]));
    } catch {
        return {};
    }
};

export default function SessionKeeper() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const setToken = useAuthStore((s) => s.setToken);
    const logout = useAuthStore((s) => s.logout);

    const [open, setOpen] = useState(false);
    const [extending, setExtending] = useState(false);

    const warnTimerRef = useRef<number | null>(null);
    const hardExpireTimerRef = useRef<number | null>(null);
    const askedRef = useRef(false); // 중복 모달 방지

    // 현재 토큰과 만료시각
    const { token, expMs } = useMemo(() => {
        const t = readToken();
        if (!t) return { token: null as string | null, expMs: null as number | null };
        const { exp } = parseJwt(t);
        return { token: t, expMs: exp ? exp * 1000 : null };
    }, [useAuthStore((s) => s.isLoggedIn), readToken()]); // isLoggedIn 변동 시 재계산

    // 타이머 정리
    const clearTimers = () => {
        if (warnTimerRef.current) {
            window.clearTimeout(warnTimerRef.current);
            warnTimerRef.current = null;
        }
        if (hardExpireTimerRef.current) {
            window.clearTimeout(hardExpireTimerRef.current);
            hardExpireTimerRef.current = null;
        }
    };

    // 세션 연장(리프레시)
    const extendSession = async () => {
        if (extending) return;
        try {
            setExtending(true);
            // ✅ 백엔드 정책에 맞게 택 1:
            // 1) httpOnly 쿠키 방식(권장)
            const csrf = Cookies.get("csrf_refresh_token");
            console.log("csrf_refresh_token from cookie:", csrf);

            const { data } = await axios.post(
                `${BASE_URL}/auth/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );
            const newAccess = data?.access_token || data?.accessToken || data?.token;
            if (!newAccess) throw new Error("No access token in refresh response");

            setToken(newAccess); // Zustand + localStorage에 저장(프로젝트의 setToken 동작에 맞게)
            askedRef.current = false; // 다음 사이클을 위해 초기화
            setOpen(false);
            setExtending(false);
            setupTimers(newAccess); // 새 만료시각 기준으로 타이머 재설정
        } catch (e) {
            setExtending(false);
            // 리프레시 실패 → 로그아웃 처리
            logout();
        }
    };

    // 만료 30초 전 모달 띄우기 + 만료 시 강제 로그아웃
    const setupTimers = (t?: string | null) => {
        clearTimers();
        const cur = t ?? token;
        if (!cur) return;

        const { exp } = parseJwt(cur);
        if (!exp) return;

        const now = Date.now();
        const expireAt = exp * 1000;
        if (now >= expireAt) {
            logout();
            return;
        }

        const warnAt = expireAt - 30_000; // 만료 30초 전
        const msToWarn = warnAt - now;
        const msToHardExpire = expireAt - now;

        // 30초 전 경고
        if (msToWarn > 0) {
            warnTimerRef.current = window.setTimeout(() => {
                if (!askedRef.current) {
                    askedRef.current = true;
                    setOpen(true);
                }
            }, msToWarn) as unknown as number;
        } else {
            // 이미 경고 시점 지남 → 즉시 알림
            if (!askedRef.current) {
                askedRef.current = true;
                setOpen(true);
            }
        }

        // 만료 시 하드 로그아웃(모달 무시한 경우)
        hardExpireTimerRef.current = window.setTimeout(() => {
            logout();
        }, msToHardExpire) as unknown as number;
    };

    // 토큰 바뀔 때마다 타이머 재설정
    useEffect(() => {
        setupTimers();
        return clearTimers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, expMs]);

    // 탭 비활성→활성 전환 시 만료 임박 체크(백그라운드에서 시간 흐른 경우)
    useEffect(() => {
        const onVisible = () => {
            const t = readToken();
            if (!t) return;
            if (isExpired(t)) {
                logout();
                return;
            }
            // 남은 시간이 30초 이하이면 모달
            const { exp } = parseJwt(t);
            if (exp) {
                const remain = exp * 1000 - Date.now();
                if (remain <= 30_000 && !askedRef.current) {
                    askedRef.current = true;
                    setOpen(true);
                }
            }
        };
        document.addEventListener("visibilitychange", onVisible, false);
        window.addEventListener("focus", onVisible, false);
        return () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", onVisible);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!open) return null;

    // 간단 모달(세션 전용, 기존 Modal과 충돌 방지)
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-[92%] max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
                <div className="text-lg font-semibold text-gray-900">로그인 연장</div>
                <p className="mt-2 text-sm text-gray-600">세션이 30초 뒤 만료됩니다. 계속 이용하시겠습니까?</p>
                <div className="mt-5 flex gap-3 justify-end">
                    <button
                        onClick={() => setOpen(false)}
                        disabled={extending}
                        className="rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                        아니요
                    </button>
                    <button
                        onClick={extendSession}
                        disabled={extending}
                        className="rounded-xl px-4 py-2 bg-[#2E7D32] text-white hover:opacity-90"
                    >
                        {extending ? "연장 중..." : "확인"}
                    </button>
                </div>
            </div>
        </div>
    );
}
