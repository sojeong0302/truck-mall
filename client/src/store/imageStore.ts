// store/imageStore.ts
import { create } from "zustand";

interface ImageStore {
    previews: string[];
    addPreview: (img: string) => void;
    removePreview: (index: number) => void;
    setPreviews: (imgs: string[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
    previews: [],
    addPreview: (img) => set((state) => ({ previews: [...state.previews, img] })),
    removePreview: (index) =>
        set((state) => ({
            previews: state.previews.filter((_, i) => i !== index),
        })),
    setPreviews: (imgs) => set({ previews: imgs }),
}));
