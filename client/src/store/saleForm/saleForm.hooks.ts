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
    type: "",
    trim: "",
    year: "",
    mileage: "",
    color: "",
    price: "",
    car_number: "",
    vin: "",
    accident_info: "",
    combination_info: "",

    // 필터 관련
    manufacturer: "",
    model: "",
    sub_model: "",
    grade: "",
    transmission: "",

    // 기타
    content: "",
    simple_content: "",
    status: true,
    simple_tags: null,

    // 메서드들
    setField: (key, value) => set({ [key]: value } as Partial<SaleFormState>),
    setThumbnail: (url) => set({ thumbnail: url }),
    setThumbnailFile: (file) => set({ thumbnailFile: file }),
    clearForm: () =>
        set({
            thumbnail: "",
            thumbnailFile: null,
            images: [],
            name: "",
            fuel: "",
            type: "",
            trim: "",
            year: "",
            mileage: "",
            color: "",
            price: "",
            car_number: "",
            vin: "",
            accident_info: "",
            combination_info: "",
            manufacturer: "",
            model: "",
            sub_model: "",
            grade: "",
            transmission: "",
            content: "",
            simple_content: "",
            status: true,
            simple_tags: null,
        }),
}));
