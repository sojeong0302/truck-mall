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
    reset: () => set({ content: "" }),
}));
