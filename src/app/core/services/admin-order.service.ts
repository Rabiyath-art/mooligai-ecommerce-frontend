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
    AdminOrder,
    AdminOrdersResponse,
    AdminOrderDetailResponse,
    UpdateOrderStatusResponse
} from '../models/admin-order.model';


@Injectable({
    providedIn: 'root'
})
export class AdminOrderService {

    private readonly http =
        inject(HttpClient);


    private readonly apiUrl =
        `${environment.apiUrl}/admin/orders`;


    // ==========================================
    // GET ADMIN ORDERS
    // ==========================================

    getOrders(
        search = '',
        paymentStatus = '',
        orderStatus = '',
        sort = '',
        page = 1,
        limit = 10
    ): Observable<AdminOrdersResponse> {

        let params =
            new HttpParams()
                .set('page', page)
                .set('limit', limit);


        if (search) {

            params =
                params.set(
                    'search',
                    search
                );

        }


        if (paymentStatus) {

            params =
                params.set(
                    'paymentStatus',
                    paymentStatus
                );

        }


        if (orderStatus) {

            params =
                params.set(
                    'orderStatus',
                    orderStatus
                );

        }


        if (sort) {

            params =
                params.set(
                    'sort',
                    sort
                );

        }


        return this.http.get<AdminOrdersResponse>(
            this.apiUrl,
            {
                params,
                withCredentials: true
            }
        );

    }


    // ==========================================
    // GET ORDER DETAIL
    // ==========================================

    getOrderById(
        id: string
    ): Observable<AdminOrderDetailResponse> {

        return this.http.get<AdminOrderDetailResponse>(
            `${this.apiUrl}/${id}`,
            {
                withCredentials: true
            }
        );

    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    updateOrderStatus(
        id: string,
        orderStatus: AdminOrder['orderStatus']
    ): Observable<UpdateOrderStatusResponse> {

        return this.http.patch<UpdateOrderStatusResponse>(
            `${this.apiUrl}/${id}/status`,
            {
                orderStatus
            },
            {
                withCredentials: true
            }
        );

    }

}