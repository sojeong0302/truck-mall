import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

// 상태 인터페이스
interface ImageState {
    previews: string[];
    setImages: (images: string[]) => void;
    addImage: (image: string) => void;
    removeImage: (index: number) => void;
}

// ✅ vanilla store 정의
export const imageStore = createStore<ImageState>((set) => ({
    previews: [],
    setImages: (images) => set({ previews: images }),
    addImage: (image) => set((state) => ({ previews: [...state.previews, image] })),
    removeImage: (index) =>
        set((state) => ({
            previews: state.previews.filter((_, i) => i !== index),
        })),
}));

// ✅ React 전용 hook: zustand/react에서 useStore를 써야 함!
export const useImageStore = <T>(selector: (state: ImageState) => T) => useStore(imageStore, selector);
