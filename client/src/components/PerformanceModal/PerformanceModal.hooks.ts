"use client";
import { create } from "zustand";
import type { PerformanceModalState } from "./PerformanceModal.types";

type Actions = {
    open: () => void;
    close: () => void;
    toggle: () => void;
};

type PerfFileState = {
    pdfFile: File | null;
    setPdfFile: (f: File | null) => void;
    reset: () => void;
};

export const usePerformanceModal = create<PerformanceModalState & Actions & PerfFileState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),

    pdfFile: null,
    setPdfFile: (f) => set({ pdfFile: f }),
    reset: () => set({ pdfFile: null }),
}));

export const openPerformanceModal = () => usePerformanceModal.getState().open();
export const closePerformanceModal = () => usePerformanceModal.getState().close();
export const togglePerformanceModal = () => usePerformanceModal.getState().toggle();
