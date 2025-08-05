// store/carFormStore.ts
import { create } from "zustand";

interface SimpleTag {
    type: string;
    grade: string;
}

interface CarFormState {
    simpleTags: SimpleTag[];
    tag: {
        manufacturer: string;
        model: string;
        subModel: string;
        grade: string;
    };
    thumbnail: string | null;
    name: string;
    fuel: string;
    type: string;
    trim: string;
    year: string;
    mileage: string;
    color: string;
    price: string;
    images: File[]; // ETC 포토들
    content: string;
    transmission: string;

    // setter 함수들
    setField: <K extends keyof CarFormState>(key: K, value: CarFormState[K]) => void;
    clearForm: () => void;
}

export const useCarFormStore = create<CarFormState>((set) => ({
    simpleTags: [],
    tag: { manufacturer: "", model: "", subModel: "", grade: "" },
    thumbnail: null,
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

    setField: (key, value) => set({ [key]: value }),
    clearForm: () =>
        set({
            simpleTags: [],
            tag: { manufacturer: "", model: "", subModel: "", grade: "" },
            thumbnail: null,
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
        }),
}));
