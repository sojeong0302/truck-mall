import { create } from "zustand";
import { SaleFormState } from "./saleForm.types";

export const useSaleFormStore = create<SaleFormState>((set) => ({
    // 이미지 관련
    thumbnail: "",
    thumbnailFile: null,
    images: [],

    // 차량 정보
    name: "",
    fuel: "",
    year: "",
    month: "",
    mileage: "",
    color: "",
    price: "",
    car_number: "",
    vin: "",
    performance_number: "",
    suggest_number: "",
    transmission: "",
    normal_tags: null,
    // 기타
    content: "",
    simple_content: "",
    status: true,
    simple_tags: null,
    performance_sheet_preview: "",
    performance_sheet_file: null,
    // 메서드들
    setField: (key, value) => set({ [key]: value } as Partial<SaleFormState>),
    setThumbnail: (url) => set({ thumbnail: url }),
    setThumbnailFile: (file) => set({ thumbnailFile: file }),
    setPerformanceSheetPreview: (url) => set({ performance_sheet_preview: url }),
    setPerformanceSheetFile: (file) => set({ performance_sheet_file: file }),
    clearForm: () =>
        set({
            thumbnail: "",
            thumbnailFile: null,
            images: [],
            name: "",
            fuel: "",
            year: "",
            mileage: "",
            color: "",
            price: "",
            car_number: "",
            vin: "",
            performance_number: "",
            suggest_number: "",
            transmission: "",
            content: "",
            simple_content: "",
            status: true,
            simple_tags: null,
            normal_tags: null,
            performance_sheet_preview: "",
            performance_sheet_file: null,
        }),
    setManufacturer: (manufacturer) =>
        set((state) => ({
            normal_tags: {
                ...state.normal_tags,
                manufacturer,
                models: state.normal_tags?.models || [],
            },
        })),
    setModel: (model) =>
        set((state) => ({
            normal_tags: {
                ...state.normal_tags,
                manufacturer: state.normal_tags?.manufacturer || "",
                models: [
                    {
                        name: model,
                        subModels: state.normal_tags?.models?.[0]?.subModels || [],
                    },
                ],
            },
        })),
    setSubModel: (subModel) =>
        set((state) => ({
            normal_tags: {
                ...state.normal_tags,
                manufacturer: state.normal_tags?.manufacturer || "",
                models: [
                    {
                        name: state.normal_tags?.models?.[0]?.name || "",
                        subModels: [
                            {
                                name: subModel,
                                grades: state.normal_tags?.models?.[0]?.subModels?.[0]?.grades || [],
                            },
                        ],
                    },
                ],
            },
        })),
    setGrade: (grades) =>
        set((state) => ({
            normal_tags: {
                ...state.normal_tags,
                manufacturer: state.normal_tags?.manufacturer || "",
                models: [
                    {
                        name: state.normal_tags?.models?.[0]?.name || "",
                        subModels: [
                            {
                                name: state.normal_tags?.models?.[0]?.subModels?.[0]?.name || "",
                                grades,
                            },
                        ],
                    },
                ],
            },
        })),
}));
