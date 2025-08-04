// store/filterTagStore.ts
import { create } from "zustand";

interface FilterTagState {
    manufacturer: string;
    model: string;
    subModel: string;
    grade: string;
    set: (key: keyof FilterTagState, value: string) => void;
    clear: () => void;
}

export const useFilterTagStore = create<FilterTagState>((set) => ({
    manufacturer: "",
    model: "",
    subModel: "",
    grade: "",
    set: (key, value) =>
        set((state) => {
            let newState;

            if (key === "manufacturer") {
                newState = { manufacturer: value, model: "", subModel: "", grade: "" };
            } else if (key === "model") {
                newState = { ...state, model: value, subModel: "", grade: "" };
            } else if (key === "subModel") {
                newState = { ...state, subModel: value, grade: "" };
            } else {
                newState = { ...state, [key]: value };
            }

            console.log("✅ 현재 선택 상태:", newState);
            return newState;
        }),
    clear: () => set({ manufacturer: "", model: "", subModel: "", grade: "" }),
}));
