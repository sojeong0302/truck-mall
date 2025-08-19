import { create } from "zustand";
import { useFilterTagStore } from "@/components/Filter/Filter.hooks"; // Filter store 사용
import { SimpleTagState } from "./simpleTag.types";

export const useSimpleTagStore = create<SimpleTagState>((set) => ({
    simpleTag: null,

    setSimpleTag: (type, grade, skipReset = false) => {
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
