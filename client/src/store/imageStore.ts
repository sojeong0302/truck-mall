// store/imageStore.ts
import { create } from "zustand";

interface ImageStore {
    previews: string[];
    files: File[];
    setPreviews: (previews: string[]) => void;
    addPreview: (preview: string) => void;
    removePreview: (index: number) => void;
    setFiles: (files: File[]) => void;
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
    previews: [],
    files: [],
    setPreviews: (previews) => set({ previews }),
    addPreview: (preview) => set((state) => ({ previews: [...state.previews, preview] })),
    removePreview: (index) =>
        set((state) => ({
            previews: state.previews.filter((_, i) => i !== index),
            files: state.files.filter((_, i) => i !== index),
        })),
    setFiles: (files) => set({ files }),
    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
    removeFile: (index) =>
        set((state) => ({
            files: state.files.filter((_, i) => i !== index),
            previews: state.previews.filter((_, i) => i !== index),
        })),
}));
