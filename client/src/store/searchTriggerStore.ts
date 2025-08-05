import { create } from "zustand";

export const useSearchTriggerStore = create<{
    trigger: number;
    fire: () => void;
}>((set) => ({
    trigger: 0,
    fire: () => set((state) => ({ trigger: state.trigger + 1 })), // 변경값 증가시켜 트리거
}));
