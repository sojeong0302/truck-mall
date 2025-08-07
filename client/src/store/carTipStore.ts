import { create } from "zustand";

interface CarTip {
    id: number;
    title: string;
    content: string;
    images: string[];
}

interface CarTipState {
    carTIPs: CarTip[];
    setCarTIPs: (tips: CarTip[]) => void;
    clearCarTIPs: () => void;
}

export const useCarTipStore = create<CarTipState>((set) => ({
    carTIPs: [],
    setCarTIPs: (tips) => set({ carTIPs: tips }),
    clearCarTIPs: () => set({ carTIPs: [] }),
}));
