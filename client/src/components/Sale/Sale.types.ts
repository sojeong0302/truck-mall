export interface SaleProps {
    id: number;
    thumbnail?: string;
    name?: string;
    fuel?: string;
    type?: string;
    trim?: string;
    year?: number;
    mileage?: string;
    color?: string;
    price?: number;
    images?: string[];
    content?: string;
    status: boolean;

    // 🆕 tag 정보 추가
    manufacturer?: string;
    model?: string;
    sub_model?: string;
    grade?: string;
}

export interface SaleComponentProps {
    posts?: SaleProps[];
    basePath: string;
    priceRange?: number[]; // ✅ 추가
    yearRange?: number[]; // ✅ 추가
}
