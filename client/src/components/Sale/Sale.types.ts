export interface SaleProps {
    id: number;
    thumbnail?: string;
    name?: string;
    fuel?: string;
    type?: string;
    trim?: string;
    year?: string;
    mileage?: string;
    color?: string;
    price?: string;
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
    posts: SaleProps[];
    basePath: string;
}
