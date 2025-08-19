import type { SimpleTag } from "@/store/simpleTag/simpleTag.types";

export interface SaleFormState {
    // 이미지 관련
    thumbnail: string; // 썸네일 미리보기 URL
    thumbnailFile: File | null; // 서버 전송용 파일 객체
    images: File[]; // 기타 이미지 파일들

    // 차량 정보
    name: string;
    fuel: string;
    type: string;
    trim: string;
    year: string;
    mileage: string;
    color: string;
    price: string;
    car_number: string;
    vin: string;
    accident_info: string;
    combination_info: string;
    transmission: string;

    // 기타
    content: string;
    simple_content: string;
    status: boolean;
    simple_tags: SimpleTag | null;

    // Zustand 메서드
    setField: (key: keyof SaleFormState, value: any) => void;
    setThumbnail: (url: string) => void;
    setThumbnailFile: (file: File | null) => void;
    clearForm: () => void;
}
