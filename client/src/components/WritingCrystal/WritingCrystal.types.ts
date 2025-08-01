import { create } from "zustand";

export interface WritingCrystalProps {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
}

export const WritingCrystalPropsStore = create<WritingCrystalProps>((set) => ({
    content: "",
    setContent: (value) => set({ content: value }),
    title: "",
    setTitle: (value) => set({ title: value }),
}));
