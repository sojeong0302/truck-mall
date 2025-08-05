import { create } from "zustand";
import { useFilterTagStore } from "@/components/Filter/Filter.types"; // ✅ 다른 store import

interface SimpleTag {
    type: string;
    grade: string;
}

interface SimpleTagState {
    simpleTag: SimpleTag | null;
    setSimpleTag: (type: string, grade: string, skipReset?: boolean) => void; // ✅ 인자 추가
    resetSimpleTag: () => void;
}

export const useSimpleTagStore = create<SimpleTagState>((set) => ({
    simpleTag: null,
    setSimpleTag: (type, grade, skipReset = false) => {
        if (!skipReset) {
            useFilterTagStore.getState().clear(); // 조건부 초기화
        }
        set({ simpleTag: { type, grade } });
    },
    resetSimpleTag: () => set({ simpleTag: null }),
}));
