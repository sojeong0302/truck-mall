export interface SaleProps {
    id: number;
    thumbnail?: string;
    name?: string;
    fuel?: string;
    year?: number;
    month?: string;
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
    suggest_number?: string;
    performance_number?: string;
    simple_content?: string;

    // 🆕 JSON 필터 정보
    simple_tags?: any;
    normal_tags?: any;
}
