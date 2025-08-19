import { create } from "zustand";
import { useFilterTagStore } from "@/components/Filter/Filter.hooks"; // ✅ 다른 store import

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
        // ✅ skipReset이 false일 때만 Filter 초기화
        if (!skipReset) {
            const filterStore = useFilterTagStore.getState();
            if (typeof filterStore.clear === "function") {
                filterStore.clear();
            }
        }
        set({ simpleTag: { type, grade } });
    },

    resetSimpleTag: () => set({ simpleTag: null }),
}));
