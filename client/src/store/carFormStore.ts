import { create } from "zustand";

interface CarFormState {
    thumbnail: string; // 미리보기 URL
    thumbnailFile: File | null; // 서버 전송용 파일
    name: string;
    fuel: string;
    type: string;
    trim: string;
    year: string;
    mileage: string;
    color: string;
    price: string;
    images: File[];
    content: string;
    transmission: string;

    setField: (key: keyof CarFormState, value: any) => void;
    setThumbnail: (url: string) => void;
    setThumbnailFile: (file: File | null) => void;
    clearForm: () => void;
}

export const useCarFormStore = create<CarFormState>((set) => ({
    thumbnail: "",
    thumbnailFile: null,
    name: "",
    fuel: "",
    type: "",
    trim: "",
    year: "",
    mileage: "",
    color: "",
    price: "",
    images: [],
    content: "",
    transmission: "",

    setField: (key, value) => set({ [key]: value } as any),
    setThumbnail: (url) => set({ thumbnail: url }),
    setThumbnailFile: (file) => set({ thumbnailFile: file }),

    clearForm: () =>
        set({
            thumbnail: "",
            thumbnailFile: null,
            name: "",
            fuel: "",
            type: "",
            trim: "",
            year: "",
            mileage: "",
            color: "",
            price: "",
            images: [],
            content: "",
            transmission: "",
        }),
}));
