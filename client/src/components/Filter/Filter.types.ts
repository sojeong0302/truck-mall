import { create } from "zustand";
import { useSimpleTagStore } from "@/store/simpleTagStore"; // ✅ 다른 store import

interface FilterTagState {
    manufacturer: string;
    model: string;
    subModel: string;
    grade: string;
    set: (key: keyof FilterTagState, value: string) => void;
    clear: () => void;
}

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    manufacturer: "",
    model: "",
    subModel: "",
    grade: "",
    set: (key, value) => {
        // ✅ SimpleTag 초기화
        useSimpleTagStore.getState().resetSimpleTag();

        let newState;
        const state = get();

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
        set(newState);
    },
    clear: () => set({ manufacturer: "", model: "", subModel: "", grade: "" }),
}));
