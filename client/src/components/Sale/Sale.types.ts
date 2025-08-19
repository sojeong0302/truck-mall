// Sale/Sale.types.ts
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
    transmission?: string;

    // 🆕 tag 정보 추가
    manufacturer?: string;
    model?: string;
    sub_model?: string;
    grade?: string;
}

export interface SaleComponentProps {
    transmission?: string;
    posts?: any[];
    priceRange?: [number, number];
    yearRange?: [number, number];
}
