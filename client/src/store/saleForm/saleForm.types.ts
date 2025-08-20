import type { SimpleTag } from "@/store/simpleTag/simpleTag.types";

export interface SaleFormState {
    name: string;
    car_number: string;
    price: number;
    year: number;
    fuel: string;
    transmission: string;
    color: string;
    mileage: number;
    vin: string;
    performance_number: string;
    suggest_number: string;

    // 이미지 관련
    thumbnail: string; // 썸네일 미리보기 URL
    thumbnailFile: File | null; // 서버 전송용 파일 객체
    images: File[]; // 기타 이미지 파일들

    // 기타
    content: string;
    simple_content: string;
    status: boolean;
    simple_tags: SimpleTag | null;

    normal_tags: {
        manufacturer: string;
        models: {
            name: string;
            subModels: {
                name: string;
                grades: string[];
            }[];
        }[];
    } | null;

    // Zustand 메서드
    setField: (key: keyof SaleFormState, value: any) => void;
    setThumbnail: (url: string) => void;
    setThumbnailFile: (file: File | null) => void;
    clearForm: () => void;
    setManufacturer: (manufacturer: string) => void;
    setModel: (model: string) => void;
    setSubModel: (subModel: string) => void;
    setGrade: (grades: string[]) => void;
}
