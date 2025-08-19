import { SaleProps } from "./Sale.types";

export interface SaleComponentProps {
    transmission?: string;
    priceRange?: [number, number];
    yearRange?: [number, number];

    // 리스트 직접 주입할 경우
    posts?: SaleProps[];

    // SimpleFilter 조건
    simpleTag?: {
        type?: string;
        grade?: string;
    };

    // Filter 조건
    manufacturer?: string;
    model?: string;
    subModel?: string;
    grade?: string;
}
