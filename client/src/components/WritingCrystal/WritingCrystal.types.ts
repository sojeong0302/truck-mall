// store/WritingCrystalPropsStore.ts
import { create } from "zustand";

export interface WritingCrystalProps {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
}

export const useWritingCrystalPropsStore = create<WritingCrystalProps>((set) => ({
    title: "",
    setTitle: (value) => set({ title: value }),
    content: "",
    setContent: (value) => set({ content: value }),
}));
