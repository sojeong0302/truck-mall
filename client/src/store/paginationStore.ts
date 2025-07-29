import { create } from "zustand";

interface PaginationState {
    currentPage: number;
    setPage: (page: number) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
    currentPage: 1,
    setPage: (page) => set({ currentPage: page }),
}));
