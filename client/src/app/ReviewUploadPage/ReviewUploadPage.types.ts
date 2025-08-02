import { create } from "zustand";

interface ReviewUploadState {
    title: string;
    setTitle: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
    images: File[]; // 이미지 파일들
    setImages: (files: File[]) => void;
}

export const useReviewUploadStore = create<ReviewUploadState>((set) => ({
    title: "",
    setTitle: (value) => set({ title: value }),
    content: "",
    setContent: (value) => set({ content: value }),
    images: [],
    setImages: (files) => set({ images: files }),
}));
