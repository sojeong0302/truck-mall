"use client";

import { create } from "zustand";

export const YearMIN = 2000;
export const YearMAX = new Date().getFullYear();
export const PriceMIN = 100;
export const PriceMAX = 10000;

type RangeType = "price" | "year";

type SearchFilterState = {
    // 값
    price: [number, number];
    year: [number, number];
    transmission: string; // 서버로 보낼 실제 값
    selectedLabel: string; // 드롭다운 표시 텍스트(전체/오토/…)
    isOpen: boolean;

    // 액션
    setPrice: (vals: [number, number]) => void;
    setYear: (vals: [number, number]) => void;
    setTransmission: (v: string) => void;
    setSelectedLabel: (v: string) => void;
    toggleOpen: () => void;
    setOpen: (v: boolean) => void;

    handleInputChange: (type: RangeType, index: number, newValue: string) => void;
    handleSelect: (label: string) => void; // 드롭다운 항목 선택
    resetAll: () => void;
};

export const useSearchFilterStore = create<SearchFilterState>((set, get) => ({
    price: [PriceMIN, PriceMAX],
    year: [YearMIN, YearMAX],
    transmission: "",
    selectedLabel: "",
    isOpen: false,

    setPrice: (vals) => set({ price: vals }),
    setYear: (vals) => set({ year: vals }),
    setTransmission: (v) => set({ transmission: v }),
    setSelectedLabel: (v) => set({ selectedLabel: v }),
    toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
    setOpen: (v) => set({ isOpen: v }),

    handleInputChange: (type, index, newValue) => {
        const num = Number(newValue.replace(/[^0-9]/g, ""));
        const isPrice = type === "price";

        const min = isPrice ? PriceMIN : YearMIN;
        const max = isPrice ? PriceMAX : YearMAX;
        const clamped = Math.min(Math.max(num, min), max);

        const current = isPrice ? [...get().price] : [...get().year];
        current[index] = clamped;

        // 최소 > 최대인 경우 보정
        if (current[0] > current[1]) current[1] = current[0];

        isPrice ? set({ price: current as [number, number] }) : set({ year: current as [number, number] });
    },

    handleSelect: (label) => {
        set({
            selectedLabel: label,
            transmission: label === "전체" ? "" : label,
            isOpen: false,
        });
    },

    resetAll: () =>
        set({
            price: [PriceMIN, PriceMAX],
            year: [YearMIN, YearMAX],
            transmission: "",
            selectedLabel: "",
            isOpen: false,
        }),
}));
