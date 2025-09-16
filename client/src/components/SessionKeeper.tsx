"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { readToken, isExpired } from "@/utils/token";

type JwtPayload = { exp?: number };
const parseJwt = (t: string): JwtPayload => {
    try {
        return JSON.parse(atob(t.split(".")[1]));
    } catch {
        return {};
    }
};

// 만료 얼마 전에 자동 갱신할지 / 경고 모달은 언제 띄울지
const SILENT_BEFORE_MS = 60_000; // 만료 60초 전 무음 리프레시
const WARN_BEFORE_MS = 10_000; // (무음 실패 시) 만료 10초 전 모달

export default function SessionKeeper() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    const setToken = useAuthStore((s) => s.setToken);
    const logout = useAuthStore((s) => s.logout);

    const [open, setOpen] = useState(false);
    const [extending, setExtending] = useState(false);

    const warnTimerRef = useRef<number | null>(null);
    const hardExpireTimerRef = useRef<number | null>(null);
    const askedRef = useRef(false); // 중복 모달 방지
    const refreshingRef = useRef(false); // 동시 리프레시 방지

    // 현재 토큰과 만료시각
    const { token, expMs } = useMemo(() => {
        const t = readToken();
        if (!t) return { token: null as string | null, expMs: null as number | null };
        const { exp } = parseJwt(t);
        return { token: t, expMs: exp ? exp * 1000 : null };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // 무음(자동) 리프레시
    async function refreshSilently(): Promise<boolean> {
        if (refreshingRef.current) return true;
        refreshingRef.current = true;
        try {
            const { data } = await axios.post(
                `${BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true } // CSRF 검사 끈 상태
            );
            const newAccess = data?.access_token || data?.accessToken || data?.token;
            if (!newAccess) throw new Error("No access token");
            setToken(newAccess);
            // 혹시 모달이 떠 있었다면 닫고 초기화
            if (open) setOpen(false);
            askedRef.current = false;
            return true;
        } catch {
            return false;
        } finally {
            refreshingRef.current = false;
        }
    }

    // 타이머/자동리프레시 스케줄
    const setupTimers = async (t?: string | null) => {
        clearTimers();
        const cur = t ?? token;
        if (!cur) return;

        const { exp } = parseJwt(cur);
        if (!exp) return;

        const now = Date.now();
        const expireAt = exp * 1000;
        const remain = expireAt - now;

        // 이미 만료 → 즉시 무음 리프레시 시도
        if (remain <= 0) {
            const ok = await refreshSilently();
            if (!ok) logout();
            return;
        }

        // 만료 임박이면 먼저 무음 리프레시 시도
        if (remain <= SILENT_BEFORE_MS) {
            const ok = await refreshSilently();
            if (ok) return; // 새 토큰으로 useEffect가 재실행되며 타이머 재설정됨
            // 실패한 경우에만 아래 경고/만료 타이머 세팅
        }

        const warnIn = Math.max(remain - WARN_BEFORE_MS, 0);

        // 경고(실패 시 대비)
        warnTimerRef.current = window.setTimeout(() => {
            if (!askedRef.current) {
                askedRef.current = true;
                setOpen(true);
            }
        }, warnIn) as unknown as number;

        // 하드 만료
        hardExpireTimerRef.current = window.setTimeout(() => {
            logout();
        }, remain) as unknown as number;
    };

    // 토큰 바뀔 때마다 타이머 재설정
    useEffect(() => {
        (async () => {
            await setupTimers();
        })();
        return clearTimers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, expMs]);

    // 탭 활성화/포커스 시에도 동일 로직 실행 (백그라운드 경과 보정)
    useEffect(() => {
        const onVisible = () => {
            const t = readToken();
            if (!t) return;
            (async () => {
                // 만료됐으면 조용히 시도, 실패 시 로그아웃
                if (isExpired(t)) {
                    const ok = await refreshSilently();
                    if (!ok) logout();
                    return;
                }
                await setupTimers(t);
            })();
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

    // 모달: 자동 리프레시가 실패한 경우에만 노출
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-[92%] max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
                <div className="text-lg font-semibold text-gray-900">로그인 연장</div>
                <p className="mt-2 text-sm text-gray-600">세션이 곧 만료됩니다. 계속 이용하시겠습니까?</p>
                <div className="mt-5 flex gap-3 justify-end">
                    <button
                        onClick={() => setOpen(false)}
                        disabled={extending}
                        className="rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                        아니요
                    </button>
                    <button
                        onClick={async () => {
                            if (extending) return;
                            try {
                                setExtending(true);
                                const ok = await refreshSilently();
                                if (ok) {
                                    askedRef.current = false;
                                    setOpen(false);
                                } else {
                                    logout();
                                }
                            } finally {
                                setExtending(false);
                            }
                        }}
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
