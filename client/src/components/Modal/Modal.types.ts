import { create } from "zustand";

export interface ModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
}

export const ModalPropsStore = create<ModalProps>((set) => ({
    isModalOpen: false,
    setIsModalOpen: (value) => set({ isModalOpen: value }),
}));
