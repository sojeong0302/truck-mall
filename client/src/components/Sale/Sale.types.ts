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

    // 🆕 tag 정보
    manufacturer?: string;
    model?: string;
    sub_model?: string;
    grade?: string;

    // 🆕 상세 정보
    car_number?: string;
    vin?: string;
    accident_info?: string;
    combination_info?: string;
    simple_content?: string;

    // 🆕 JSON 필터 정보
    simple_tags?: any;
    normal_tags?: any;
}
