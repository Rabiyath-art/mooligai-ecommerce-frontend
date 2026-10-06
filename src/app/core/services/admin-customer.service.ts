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
    CustomerListResponse,
    CustomerDetailResponse,
    Customer
} from '../models/customer.model';


@Injectable({
    providedIn: 'root'
})
export class AdminCustomerService {

    private readonly http =
        inject(HttpClient);


    private readonly apiUrl =
        `${environment.apiUrl}/admin/customers`;


    // =====================================================
    // CUSTOMER LIST
    // =====================================================

    getCustomers(
        search = '',
        status = '',
        page = 1,
        limit = 10,
        sort = ''
    ): Observable<CustomerListResponse> {

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


        if (sort) {

            params =
                params.set(
                    'sort',
                    sort
                );

        }


        return this.http.get<CustomerListResponse>(
            this.apiUrl,
            {
                params,
                withCredentials: true
            }
        );

    }


    // =====================================================
    // CUSTOMER DETAIL
    // =====================================================

    getCustomerById(
        id: string
    ): Observable<CustomerDetailResponse> {

        return this.http.get<CustomerDetailResponse>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );

    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    updateCustomerStatus(
        id: string,
        isActive: boolean
    ): Observable<{
        success: boolean;
        message: string;
        data: Customer;
    }> {

        return this.http.patch<{
            success: boolean;
            message: string;
            data: Customer;
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

}