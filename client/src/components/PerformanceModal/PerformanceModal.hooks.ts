"use client";
import { create } from "zustand";
import type { PerformanceModalState } from "./PerformanceModal.types";

type Actions = {
    open: () => void;
    close: () => void;
    toggle: () => void;
};

export const usePerformanceModal = create<PerformanceModalState & Actions>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

export const openPerformanceModal = () => usePerformanceModal.getState().open();
export const closePerformanceModal = () => usePerformanceModal.getState().close();
export const togglePerformanceModal = () => usePerformanceModal.getState().toggle();
