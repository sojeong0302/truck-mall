// store/imageStore.ts
import { create } from "zustand";

interface ImageStore {
    previews: string[];
    addPreview: (image: string) => void;
    removePreview: (index: number) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
    previews: [],
    addPreview: (image) => set((state) => ({ previews: [...state.previews, image] })),
    removePreview: (index) =>
        set((state) => ({
            previews: state.previews.filter((_, i) => i !== index),
        })),
}));
