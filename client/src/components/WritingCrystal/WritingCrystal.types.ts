// store/WritingCrystalPropsStore.ts
import { create } from "zustand";

export interface WritingCrystalProps {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
    prevImages: string[];
    setPrevImages: (images: string[]) => void;
    addPrevImage: (url: string) => void;
    removePrevImage: (index: number) => void;
    newImages: File[];
    setNewImages: (files: File[]) => void;
    addNewImage: (file: File) => void;
    clearAll: () => void;
}

export const useWritingCrystalPropsStore = create<WritingCrystalProps>((set) => ({
    title: "",
    setTitle: (value) => set({ title: value }),
    content: "",
    setContent: (value) => set({ content: value }),
    prevImages: [],
    setPrevImages: (images) => set({ prevImages: images }),
    addPrevImage: (url) => set((state) => ({ prevImages: [...state.prevImages, url] })),
    removePrevImage: (index) =>
        set((state) => ({
            prevImages: state.prevImages.filter((_, i) => i !== index),
        })),
    newImages: [],
    setNewImages: (files) => set({ newImages: files }),
    addNewImage: (file) => set((state) => ({ newImages: [...state.newImages, file] })),
    clearAll: () =>
        set({
            title: "",
            content: "",
            prevImages: [],
            newImages: [],
        }),
}));
