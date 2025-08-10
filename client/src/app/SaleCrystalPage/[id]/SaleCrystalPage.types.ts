import { create } from "zustand";

interface SaleCrystalPageProp {
    thumbnail: string;
    setThumbnail: (value: string) => void;
    name: string;
    setName: (value: string) => void;
    fuel: string;
    setFuel: (value: string) => void;
    type: string;
    setType: (value: string) => void;
    trim: string;
    setTrim: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    mileage: string;
    setMileage: (value: string) => void;
    color: string;
    setColor: (value: string) => void;
    price: string;
    setPrice: (value: string) => void;
    content: string;
    setContent: (value: string) => void;
    images: File[];
    setImages: (files: File[]) => void;
    addImage: (file: File) => void;
    removeImage: (index: number) => void;
    transmission: string; // ✅ 변속기 추가
    setTransmission: (value: string) => void; // ✅ 변속기 setter 추가
    reset: () => void;
}

export const SaleCrystalPagePropStore = create<SaleCrystalPageProp>((set) => ({
    thumbnail: "",
    setThumbnail: (value) => set({ thumbnail: value }),
    name: "",
    setName: (value) => set({ name: value }),
    fuel: "",
    setFuel: (value) => set({ fuel: value }),
    type: "",
    setType: (value) => set({ type: value }),
    trim: "",
    setTrim: (value) => set({ trim: value }),
    year: "",
    setYear: (value) => set({ year: value }),
    mileage: "",
    setMileage: (value) => set({ mileage: value }),
    color: "",
    setColor: (value) => set({ color: value }),
    price: "",
    setPrice: (value) => set({ price: value }),
    content: "",
    setContent: (value) => set({ content: value }),
    images: [],
    setImages: (files) => set({ images: files }),
    addImage: (file) => set((state) => ({ images: [...state.images, file] })),
    removeImage: (index) =>
        set((state) => ({
            images: state.images.filter((_, i) => i !== index),
        })),
    transmission: "",
    setTransmission: (value) => set({ transmission: value }),

    reset: () =>
        set({
            thumbnail: "",
            name: "",
            fuel: "",
            type: "",
            trim: "",
            year: "",
            mileage: "",
            color: "",
            price: "",
            content: "",
            images: [],
        }),
}));
