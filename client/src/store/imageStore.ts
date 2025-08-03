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
}

export const useImageStore = create<ImageStoreState>((set) => ({
    previews: [],
    files: [],
    originURLs: [],
    setOriginURLs: (urls) => set({ originURLs: urls, previews: urls }),
    addPreview: (url) => set((state) => ({ previews: [...state.previews, url] })),
    removePreview: (index) =>
        set((state) => {
            const newPreviews = state.previews.filter((_, i) => i !== index);
            const removed = state.previews[index];

            const newOriginURLs = state.originURLs.includes(removed)
                ? state.originURLs.filter((url) => url !== removed)
                : state.originURLs;

            const newFiles =
                index < state.originURLs.length
                    ? state.files // 기존 이미지 삭제 시 파일 변화 없음
                    : state.files.filter((_, i) => i !== index - state.originURLs.length);

            return {
                previews: newPreviews,
                originURLs: newOriginURLs,
                files: newFiles,
            };
        }),

    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
    clear: () => set({ files: [], previews: [], originURLs: [] }),
    setPreviews: (urls) => set({ previews: urls }),
}));
