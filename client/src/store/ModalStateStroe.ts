import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
    isModalOpen: false,
    setIsModalOpen: (value) => set({ isModalOpen: value }),
}));
