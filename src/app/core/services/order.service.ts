// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//     providedIn: 'root'
// })
// export class OrderService {

//     private readonly http = inject(HttpClient);
//     private readonly apiUrl = `${environment.apiUrl}/orders`;

//     createOrder(addressId: string): Observable<any> {
//         return this.http.post(
//             this.apiUrl,
//             {
//                 addressId
//             },
//             {
//                 withCredentials: true
//             }
//         );
//     }

//     getMyOrders(): Observable<any> {
//         return this.http.get(
//             this.apiUrl,
//             {
//                 withCredentials: true
//             }
//         );

//     }

//     getOrderById(orderId: string): Observable<any> {
//         return this.http.get(`${this.apiUrl}/${orderId}`, {
//             withCredentials: true
//         });

//     }

// }

import { Injectable, inject } from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    Order
} from '../models/order.model';


@Injectable({
    providedIn: 'root'
})
export class OrderService {


    private readonly http =
        inject(HttpClient);


    private readonly apiUrl =
        `${environment.apiUrl}/orders`;


    // =====================================================
    // CREATE ORDER
    // =====================================================

    createOrder(
        addressId: string
    ): Observable<{
        success: boolean;
        message: string;
        data: Order;
    }> {

        return this.http.post<{
            success: boolean;
            message: string;
            data: Order;
        }>(
            this.apiUrl,
            {
                addressId
            },
            {
                withCredentials: true
            }
        );

    }


    // =====================================================
    // GET MY ORDERS
    // =====================================================

    getMyOrders(): Observable<{
        success: boolean;
        data: Order[];
    }> {

        return this.http.get<{
            success: boolean;
            data: Order[];
        }>(
            `${this.apiUrl}/my-orders`,
            {
                withCredentials: true
            }
        );

    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    getOrderById(
        orderId: string
    ): Observable<{
        success: boolean;
        data: Order;
    }> {

        return this.http.get<{
            success: boolean;
            data: Order;
        }>(
            `${this.apiUrl}/${orderId}`,
            {
                withCredentials: true
            }
        );

    }

}