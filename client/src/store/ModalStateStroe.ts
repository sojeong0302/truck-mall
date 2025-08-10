import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    isSaleCompleteModalOpen: boolean; // ✅ 추가
    setIsSaleCompleteModalOpen: (v: boolean) => void; // ✅ 추가
}

export const useModalStore = create<ModalState>((set) => ({
    isModalOpen: false,
    setIsModalOpen: (value) => set({ isModalOpen: value }),
    isSaleCompleteModalOpen: false, // ✅ 추가
    setIsSaleCompleteModalOpen: (v) => set({ isSaleCompleteModalOpen: v }), // ✅ 추가
}));
