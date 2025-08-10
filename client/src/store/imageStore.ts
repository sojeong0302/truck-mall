import { create } from "zustand";

interface ImageStoreState {
    previews: string[]; // base64 + 기존 URL 포함
    files: File[]; // 새로 추가된 이미지
    originURLs: string[]; // 최초 서버에서 받은 기존 URL
    setOriginURLs: (urls: string[]) => void;
    addPreview: (url: string) => void;
    removePreview: (index: number) => void;
    addFile: (file: File) => void;
    clear: () => void;
    setPreviews: (urls: string[]) => void;
    setFiles: (files: File[]) => void;
}

export const useImageStore = create<ImageStoreState>((set) => ({
    previews: [],
    files: [],
    originURLs: [],

    setOriginURLs: (urls) =>
        set({
            originURLs: urls,
            previews: [...urls],
        }),

    addPreview: (url) => set((state) => ({ previews: [...state.previews, url] })),

    removePreview: (index) =>
        set((state) => {
            const newPreviews = state.previews.filter((_, i) => i !== index);

            const isOrigin = index < state.originURLs.length;
            const newOriginURLs = isOrigin ? state.originURLs.filter((_, i) => i !== index) : state.originURLs;

            const newFiles = isOrigin
                ? state.files
                : state.files.filter((_, i) => i !== index - state.originURLs.length);

            return {
                previews: newPreviews,
                originURLs: newOriginURLs,
                files: newFiles,
            };
        }),

    addFile: (file) => set((state) => ({ files: [...state.files, file] })),

    setFiles: (files) => set({ files }), // <- 구현부 추가

    clear: () => set({ files: [], previews: [], originURLs: [] }),

    setPreviews: (urls) => set({ previews: urls }),
}));
