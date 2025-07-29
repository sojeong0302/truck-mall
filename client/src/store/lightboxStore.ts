import { create } from "zustand";

interface LightboxState {
    open: boolean;
    selectedIndex: number;
    setOpen: (value: boolean) => void;
    setSelectedIndex: (index: number) => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
    open: false,
    selectedIndex: 0,
    setOpen: (value) => set({ open: value }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
}));
