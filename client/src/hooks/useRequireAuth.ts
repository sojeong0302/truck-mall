// src/hooks/useRequireAuth.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthToggle } from "@/components/Header/Header.hooks"; // ✅ 이미 쓰시던 훅

export function useRequireAuth() {
    const token = useAuthStore((s) => s.token);
    const router = useRouter();
    const { isHydrated } = useAuthToggle(); // ✅ 하이드레이션 끝났는지

    useEffect(() => {
        if (!isHydrated) return; // 하이드레이션 될 때까지 대기
        if (!token) {
            const here = window.location.pathname + window.location.search;
            router.replace(`/LoginPage?next=${encodeURIComponent(here)}`);
        }
    }, [isHydrated, token, router]);
}
