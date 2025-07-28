"use client";

import { useAuthStore } from "@/store/useAuthStore";

export const useAuthToggle = () => {
    const { isLoggedIn, login, logout } = useAuthStore();

    const toggleAuth = () => {
        isLoggedIn ? logout() : login();
    };

    return { isLoggedIn, toggleAuth };
};
