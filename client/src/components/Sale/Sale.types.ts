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
}

export interface SaleComponentProps {
    posts: SaleProps[];
    basePath: string;
}
