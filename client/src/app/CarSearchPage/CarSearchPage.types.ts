"use client";

import { create } from "zustand";

export const YearMIN = 1990;
export const YearMAX = new Date().getFullYear();
export const PriceMIN = 0;
export const PriceMAX = 10000;

type RangeType = "price" | "year";

type SearchFilterState = {
    /** 적용된 값 (실제 API/필터에 쓰이는 값) */
    price: [number, number];
    year: [number, number];
    transmission: string; // 서버로 보낼 실제 값
    selectedLabel: string; // 드롭다운 표시 텍스트

    /** 드래프트 값 (UI에서 움직이는 값) */
    draftPrice: [number, number];
    draftYear: [number, number];
    draftTransmission: string;
    draftSelectedLabel: string;

    /** UI 상태 */
    isOpen: boolean;

    /** applied setters (보통 직접 안 씀) */
    setPrice: (vals: [number, number]) => void;
    setYear: (vals: [number, number]) => void;
    setTransmission: (v: string) => void;
    setSelectedLabel: (v: string) => void;

    /** draft setters (슬라이더/인풋/드롭다운은 이걸로만 변경) */
    setDraftPrice: (vals: [number, number]) => void;
    setDraftYear: (vals: [number, number]) => void;
    setDraftTransmission: (v: string) => void;
    setDraftSelectedLabel: (v: string) => void;

    /** 공용 UI */
    toggleOpen: () => void;
    setOpen: (v: boolean) => void;

    /** 인풋 변경(드래프트용) */
    handleInputChangeDraft: (type: RangeType, index: number, newValue: string) => void;
    handleSelectDraft: (label: string) => void; // 드롭다운 항목 선택(draft만)

    /** 적용/초기화 */
    applyFilters: () => void; // ✅ 검색 버튼에서 호출
    resetDraft: () => void; // 표시값만 초기화
    resetAll: () => void; // 표시값+적용값 모두 초기화
};

export const useSearchFilterStore = create<SearchFilterState>((set, get) => ({
    // 적용값 초기값
    price: [PriceMIN, PriceMAX],
    year: [YearMIN, YearMAX],
    transmission: "",
    selectedLabel: "",

    // 드래프트 초기값
    draftPrice: [PriceMIN, PriceMAX],
    draftYear: [YearMIN, YearMAX],
    draftTransmission: "",
    draftSelectedLabel: "",

    isOpen: false,

    // applied setters
    setPrice: (vals) => set({ price: vals }),
    setYear: (vals) => set({ year: vals }),
    setTransmission: (v) => set({ transmission: v }),
    setSelectedLabel: (v) => set({ selectedLabel: v }),

    // draft setters
    setDraftPrice: (vals) => set({ draftPrice: vals }),
    setDraftYear: (vals) => set({ draftYear: vals }),
    setDraftTransmission: (v) => set({ draftTransmission: v }),
    setDraftSelectedLabel: (v) => set({ draftSelectedLabel: v }),

    // UI
    toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
    setOpen: (v) => set({ isOpen: v }),

    // 숫자 인풋 → draft만 조정
    handleInputChangeDraft: (type, index, newValue) => {
        const num = Number(String(newValue).replace(/[^0-9]/g, ""));
        const isPrice = type === "price";

        const min = isPrice ? PriceMIN : YearMIN;
        const max = isPrice ? PriceMAX : YearMAX;
        const clamped = Math.min(Math.max(num, min), max);

        const curr = isPrice ? [...get().draftPrice] : [...get().draftYear];
        curr[index] = clamped;

        if (curr[0] > curr[1]) curr[1] = curr[0];

        isPrice ? set({ draftPrice: curr as [number, number] }) : set({ draftYear: curr as [number, number] });
    },

    // 드롭다운 선택 → draft만 변경
    handleSelectDraft: (label) => {
        set({
            draftSelectedLabel: label,
            draftTransmission: label === "전체" ? "" : label,
            isOpen: false,
        });
    },

    // ✅ 검색 버튼에서 호출: draft → applied로 복사
    applyFilters: () =>
        set((s) => ({
            price: s.draftPrice,
            year: s.draftYear,
            transmission: s.draftTransmission,
            selectedLabel: s.draftSelectedLabel,
        })),

    // 표시값만 초기화
    resetDraft: () =>
        set({
            draftPrice: [PriceMIN, PriceMAX],
            draftYear: [YearMIN, YearMAX],
            draftTransmission: "",
            draftSelectedLabel: "",
            isOpen: false,
        }),

    // 표시값 + 적용값 모두 초기화
    resetAll: () =>
        set({
            price: [PriceMIN, PriceMAX],
            year: [YearMIN, YearMAX],
            transmission: "",
            selectedLabel: "",
            draftPrice: [PriceMIN, PriceMAX],
            draftYear: [YearMIN, YearMAX],
            draftTransmission: "",
            draftSelectedLabel: "",
            isOpen: false,
        }),
}));
