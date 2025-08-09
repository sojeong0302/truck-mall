"use client";

import { create } from "zustand";
import axios from "axios";
import type { SaleProps } from "@/components/Sale/Sale.types";

interface SaleDetailState {
    post: SaleProps | null;
    loading: boolean;
    error: string | null;

    fetchById: (baseUrl: string, id: string) => Promise<void>;
    clear: () => void;
}

export const useSaleDetailStore = create<SaleDetailState>((set) => ({
    post: null,
    loading: false,
    error: null,

    async fetchById(baseUrl, id) {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${baseUrl}/sale/${id}`);
            set({ post: res.data ?? null });
        } catch (e: any) {
            set({ error: e?.message ?? "failed to load", post: null });
        } finally {
            set({ loading: false });
        }
    },

    clear() {
        set({ post: null, loading: false, error: null });
    },
}));
