import { Product } from "./product.model";

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductListResponse {
    success: boolean;
    data: Product[];
    pagination: Pagination;
}
