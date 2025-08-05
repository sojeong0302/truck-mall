import { create } from "zustand";
import { useSimpleTagStore } from "@/store/simpleTagStore"; // ✅ 다른 store import

interface FilterTagState {
    manufacturer: string;
    model: string;
    subModel: string;
    grade: string;
    set: (key: keyof FilterTagState, value: string, skipReset?: boolean) => void; // ✅ 인자 추가
    clear: () => void;
}

export const useFilterTagStore = create<FilterTagState>((set, get) => ({
    manufacturer: "",
    model: "",
    subModel: "",
    grade: "",
    set: (key, value, skipReset = false) => {
        if (!skipReset) {
            useSimpleTagStore.getState().resetSimpleTag(); // 조건부 초기화
        }

        const state = get();
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
        set(newState);
    },
    clear: () => set({ manufacturer: "", model: "", subModel: "", grade: "" }),
}));
