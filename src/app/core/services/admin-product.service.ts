import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient,
    HttpParams
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    Product
} from '../models/product.model';


export interface AdminProductResponse {

    success: boolean;

    data: Product[];

    pagination: {

        total: number;

        page: number;

        limit: number;

        totalPages: number;

    };

}


export interface AdminProductSingleResponse {

    success: boolean;

    data: Product;

}


export interface AdminProductMutationResponse {

    success: boolean;

    message: string;

    data?: Product;

}


@Injectable({
    providedIn: 'root'
})
export class AdminProductService {

    private readonly http =
        inject(HttpClient);


    private readonly apiUrl =
        `${environment.apiUrl}/admin/products`;


    // ========================================
    // GET PRODUCTS
    // ========================================

    getProducts(
        params?: {
            search?: string;
            category?: string;
            status?: string;
            stock?: string;
            minPrice?: number;
            maxPrice?: number;
            sort?: string;
            page?: number;
            limit?: number;
        }
    ): Observable<AdminProductResponse> {

        let httpParams =
            new HttpParams();


        if (params?.search) {

            httpParams =
                httpParams.set(
                    'search',
                    params.search
                );

        }


        if (params?.category) {

            httpParams =
                httpParams.set(
                    'category',
                    params.category
                );

        }


        if (params?.status) {

            httpParams =
                httpParams.set(
                    'status',
                    params.status
                );

        }


        if (params?.stock) {

            httpParams =
                httpParams.set(
                    'stock',
                    params.stock
                );

        }


        if (
            params?.minPrice !== undefined
        ) {

            httpParams =
                httpParams.set(
                    'minPrice',
                    params.minPrice
                );

        }


        if (
            params?.maxPrice !== undefined
        ) {

            httpParams =
                httpParams.set(
                    'maxPrice',
                    params.maxPrice
                );

        }


        if (params?.sort) {

            httpParams =
                httpParams.set(
                    'sort',
                    params.sort
                );

        }


        httpParams =
            httpParams.set(
                'page',
                params?.page ?? 1
            );


        httpParams =
            httpParams.set(
                'limit',
                params?.limit ?? 10
            );


        return this.http.get<AdminProductResponse>(
            this.apiUrl,
            {
                params: httpParams,
                withCredentials: true
            }
        );

    }


    // ========================================
    // GET PRODUCT BY ID
    // ========================================

    getProductById(
        id: string
    ): Observable<AdminProductSingleResponse> {

        return this.http.get<AdminProductSingleResponse>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );

    }


    // ========================================
    // CREATE
    // ========================================

    createProduct(
        formData: FormData
    ): Observable<AdminProductMutationResponse> {

        return this.http.post<AdminProductMutationResponse>(
            this.apiUrl,
            formData,
            {
                withCredentials: true
            }
        );

    }


    // ========================================
    // UPDATE
    // ========================================

    updateProduct(
        id: string,
        formData: FormData
    ): Observable<AdminProductMutationResponse> {

        return this.http.put<AdminProductMutationResponse>(
            `${this.apiUrl}/${id}`,
            formData,
            {
                withCredentials: true
            }
        );

    }


    // ========================================
    // DELETE
    // ========================================

    deleteProduct(
        id: string
    ): Observable<AdminProductMutationResponse> {

        return this.http.delete<AdminProductMutationResponse>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );

    }


    // ========================================
    // STATUS
    // ========================================

    updateProductStatus(
        id: string,
        isActive: boolean
    ): Observable<AdminProductMutationResponse> {

        return this.http.patch<AdminProductMutationResponse>(
            `${this.apiUrl}/${id}/status`,
            {
                isActive
            },
            {
                withCredentials: true
            }
        );

    }

}