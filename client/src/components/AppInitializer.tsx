"use client";
import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function AppInitializer() {
    const setToken = useAuthStore((s) => s.setToken);

    useEffect(() => {
        // 프로젝트에 따라 키가 다를 수 있어 둘 다 체크
        const t =
            typeof window !== "undefined"
                ? localStorage.getItem("token") || localStorage.getItem("access_token")
                : null;

        if (t) {
            setToken(t);
            axios.defaults.headers.common.Authorization = `Bearer ${t}`;
        } else {
            delete axios.defaults.headers.common.Authorization;
        }
    }, [setToken]);

    return null;
}
