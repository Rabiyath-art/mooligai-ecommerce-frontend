import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
    // _id: string;
    // name: string;
    // slug: string;
    // isActive?: boolean;
    _id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category[];
}
export interface CategoryPagination {

    total: number;

    page: number;

    limit: number;

    totalPages: number;
}
export interface AdminCategoryResponse {

    success: boolean;

    data: Category[];

    pagination: CategoryPagination;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/categories`;


    // getCategories(): Observable<CategoryResponse> {

    //     return this.http.get<CategoryResponse>(
    //         this.apiUrl,
    //         {
    //             withCredentials: true
    //         }
    //     );

    // }

    // =========================
    // PUBLIC CATEGORIES
    // =========================

    getCategories(): Observable<{
        success: boolean;
        data: Category[];
    }> {

        return this.http.get<{
            success: boolean;
            data: Category[];
        }>(
            this.apiUrl
        );

    }


    // =========================
    // ADMIN LIST
    // =========================

    getAdminCategories(
        search: string = '',
        status: string = '',
        page: number = 1,
        limit: number = 10
    ): Observable<AdminCategoryResponse> {

        let params =
            new HttpParams()
                .set('page', page)
                .set('limit', limit);


        if (search.trim()) {

            params =
                params.set(
                    'search',
                    search.trim()
                );

        }


        if (status) {

            params =
                params.set(
                    'status',
                    status
                );

        }


        return this.http.get<AdminCategoryResponse>(
            `${this.apiUrl}/admin/list`,
            {
                params,
                withCredentials: true
            }
        );

    }


    // =========================
    // GET BY ID
    // =========================

    getCategoryById(
        id: string
    ): Observable<{
        success: boolean;
        data: Category;
    }> {

        return this.http.get<{
            success: boolean;
            data: Category;
        }>(
            `${this.apiUrl}/${id}`
        );

    }


    // =========================
    // CREATE
    // =========================

    createCategory(
        data: Partial<Category>
    ): Observable<{
        success: boolean;
        message: string;
        data: Category;
    }> {

        return this.http.post<{
            success: boolean;
            message: string;
            data: Category;
        }>(
            this.apiUrl,
            data,
            {
                withCredentials: true
            }
        );

    }


    // =========================
    // UPDATE
    // =========================

    updateCategory(
        id: string,
        data: Partial<Category>
    ): Observable<{
        success: boolean;
        message: string;
        data: Category;
    }> {

        return this.http.put<{
            success: boolean;
            message: string;
            data: Category;
        }>(
            `${this.apiUrl}/${id}`,
            data,
            {
                withCredentials: true
            }
        );

    }


    // =========================
    // STATUS
    // =========================

    updateCategoryStatus(
        id: string,
        isActive: boolean
    ): Observable<{
        success: boolean;
        message: string;
        data: Category;
    }> {

        return this.http.patch<{
            success: boolean;
            message: string;
            data: Category;
        }>(
            `${this.apiUrl}/${id}/status`,
            {
                isActive
            },
            {
                withCredentials: true
            }
        );

    }


    // =========================
    // DELETE
    // =========================

    deleteCategory(
        id: string
    ): Observable<{
        success: boolean;
        message: string;
    }> {

        return this.http.delete<{
            success: boolean;
            message: string;
        }>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );

    }

}