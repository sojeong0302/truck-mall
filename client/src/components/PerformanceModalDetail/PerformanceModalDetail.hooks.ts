"use client";
import { create } from "zustand";

type State = {
    isOpen: boolean;
    performanceNumber: string | null;
    pdfUrls: string[]; // 서버에서 받은 pdf url 배열
    loading: boolean;
    error?: string | null;
};
type Actions = {
    open: (performanceNumber: string) => void;
    close: () => void;
    setPdfUrls: (urls: string[]) => void;
    setLoading: (v: boolean) => void;
    setError: (msg?: string | null) => void;
};

export const usePerformanceModal = create<State & Actions>((set) => ({
    isOpen: false,
    performanceNumber: null,
    pdfUrls: [],
    loading: false,
    error: null,

    open: (performanceNumber) => set({ isOpen: true, performanceNumber, pdfUrls: [], error: null }),
    close: () => set({ isOpen: false, performanceNumber: null, pdfUrls: [], error: null }),
    setPdfUrls: (urls) => set({ pdfUrls: urls }),
    setLoading: (v) => set({ loading: v }),
    setError: (msg) => set({ error: msg ?? null }),
}));

// 외부에서 쓰기 편한 헬퍼
export const openPerformanceDetail = (no: string) => usePerformanceModal.getState().open(no);
export const closePerformanceDetail = () => usePerformanceModal.getState().close();
