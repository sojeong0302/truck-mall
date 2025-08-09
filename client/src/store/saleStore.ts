"use client";

import { create } from "zustand";
import { SaleProps } from "@/components/Sale/Sale.types";

interface SaleState {
    sales: SaleProps[];
    setSales: (sales: SaleProps[]) => void;
    clearSales: () => void;
}

export const useSaleStore = create<SaleState>((set) => ({
    sales: [],
    setSales: (sales) => set({ sales }),
    clearSales: () => set({ sales: [] }),
}));
