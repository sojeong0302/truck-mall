"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppInitializer() {
    const { login } = useAuthStore();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            login(); // 🔐 토큰이 있으면 로그인 상태로 전환
        }
    }, []);

    return null;
}
