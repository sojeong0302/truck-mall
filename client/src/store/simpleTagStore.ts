// /store/simpleTagStore.ts
import { create } from "zustand";

interface SimpleTag {
    type: string;
    grade: string;
}

interface SimpleTagState {
    simpleTag: SimpleTag[];
    setSimpleTag: (type: string, grade: string) => void;
    resetSimpleTag: () => void;
}

export const useSimpleTagStore = create<SimpleTagState>((set) => ({
    simpleTag: [],
    setSimpleTag: (type, grade) =>
        set((state) => {
            const exists = state.simpleTag.find((t) => t.type === type);
            const updated = exists
                ? state.simpleTag.map((t) => (t.type === type ? { type, grade } : t))
                : [...state.simpleTag, { type, grade }];
            return { simpleTag: updated };
        }),
    resetSimpleTag: () => set({ simpleTag: [] }),
}));
