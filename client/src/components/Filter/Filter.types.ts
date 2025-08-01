import { create } from "zustand";

type FilterKey = "manufacturer" | "model" | "subModel" | "grade";

type FilterState = {
    manufacturer: string;
    model: string;
    subModel: string;
    grade: string;
    set: (key: FilterKey, value: string) => void;
    reset: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
    manufacturer: "",
    model: "",
    subModel: "",
    grade: "",
    set: (key, value) => {
        const resetMap: Record<FilterKey, Partial<FilterState>> = {
            manufacturer: { model: "", subModel: "", grade: "" },
            model: { subModel: "", grade: "" },
            subModel: { grade: "" },
            grade: {},
        };

        return set((state) => ({
            ...state,
            [key]: value,
            ...resetMap[key],
        }));
    },
    reset: () => set({ manufacturer: "", model: "", subModel: "", grade: "" }),
}));
