import { create } from "zustand";
import { useFilterTagStore } from "@/components/Filter/Filter.types"; // ✅ 다른 store import

interface SimpleTag {
    type: string;
    grade: string;
}

interface SimpleTagState {
    simpleTag: SimpleTag | null;
    setSimpleTag: (type: string, grade: string) => void;
    resetSimpleTag: () => void;
}

export const useSimpleTagStore = create<SimpleTagState>((set) => ({
    simpleTag: null,
    setSimpleTag: (type, grade) => {
        // ✅ FilterTag 초기화
        useFilterTagStore.getState().clear();
        set({ simpleTag: { type, grade } });
    },
    resetSimpleTag: () => set({ simpleTag: null }),
}));
