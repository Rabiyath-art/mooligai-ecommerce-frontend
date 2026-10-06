import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface AdminDashboardUser {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface AdminDashboardOrder {
    _id: string;
    user?: AdminDashboardUser;

    totalAmount: number;

    orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

    payment?: {
        status?: string;
    };

    createdAt: string;
}

export interface AdminDashboardData {

    totalSales: number;

    totalOrders: number;

    totalProducts: number;

    totalCustomers: number;

    recentOrders: AdminDashboardOrder[];
}

export interface AdminDashboardResponse {

    success: boolean;

    data: AdminDashboardData;
}

@Injectable({
    providedIn: 'root'
})
export class AdminDashboardService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl;

    getDashboard(): Observable<AdminDashboardResponse> {

        return this.http.get<AdminDashboardResponse>(
            `${this.apiUrl}/admin/dashboard`,
            {
                withCredentials: true
            }
        );

    }

}
