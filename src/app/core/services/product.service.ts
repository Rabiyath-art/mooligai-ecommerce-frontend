import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductListResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/products`;

    getProducts(options?: {
        search?: string; category?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
        page?: number;
        limit?: number;
    }): Observable<ProductListResponse> {

        let params = new HttpParams();
        if (options?.search) { params = params.set('search', options.search); }
        if (options?.category) {
            params = params.set(
                'category',
                options.category
            );
        }

        if (options?.minPrice !== undefined) {
            params = params.set(
                'minPrice',
                options.minPrice
            );
        }

        if (options?.maxPrice !== undefined) {
            params = params.set(
                'maxPrice',
                options.maxPrice
            );
        }

        if (options?.sort) {
            params = params.set(
                'sort',
                options.sort
            );
        }

        if (options?.page) {
            params = params.set(
                'page',
                options.page
            );
        }

        if (options?.limit) {
            params = params.set(
                'limit',
                options.limit
            );
        }

        return this.http.get<ProductListResponse>(
            this.apiUrl,
            { params }
        );
    }

    getProductById(productId: string): Observable<{ success: boolean; data: Product; }> {
        return this.http.get<{ success: boolean; data: Product; }>(`${this.apiUrl}/${productId}`);
    }
}