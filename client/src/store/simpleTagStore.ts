// /store/simpleTagStore.ts
import { create } from "zustand";

interface SimpleTag {
    type: string;
    grade: string;
}

interface SimpleTagState {
    simpleTag: SimpleTag | null; // ✅ 객체 or null
    setSimpleTag: (type: string, grade: string) => void;
    resetSimpleTag: () => void;
}

export const useSimpleTagStore = create<SimpleTagState>((set) => ({
    simpleTag: null,
    setSimpleTag: (type, grade) => set(() => ({ simpleTag: { type, grade } })),
    resetSimpleTag: () => set({ simpleTag: null }),
}));
