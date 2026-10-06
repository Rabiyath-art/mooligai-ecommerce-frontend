import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import {
    AdminDashboardService,
    AdminDashboardOrder
} from '../../../core/services/admin-dashboard.service';


interface DashboardStat {

    title: string;

    value: string;

    icon: string;

}


@Component({
    selector: 'app-admin-dashboard',

    standalone: true,

    imports: [
        CommonModule,
        RouterLink,
        MatIconModule
    ],

    templateUrl:
        './admin-dashboard.component.html',

    styleUrl:
        './admin-dashboard.component.scss'
})
export class AdminDashboardComponent
    implements OnInit {


    private dashboardService =
        inject(AdminDashboardService);


    // ========================================
    // STATE
    // ========================================

    loading = true;

    errorMessage = '';


    // ========================================
    // DASHBOARD DATA
    // ========================================

    totalSales = 0;

    totalOrders = 0;

    totalProducts = 0;

    totalCustomers = 0;


    recentOrders:
        AdminDashboardOrder[] = [];


    // ========================================
    // STATS
    // ========================================

    stats: DashboardStat[] = [];


    // ========================================
    // INIT
    // ========================================

    ngOnInit(): void {

        this.loadDashboard();

    }


    // ========================================
    // LOAD DASHBOARD
    // ========================================

    loadDashboard(): void {

        this.loading = true;

        this.errorMessage = '';


        this.dashboardService
            .getDashboard()
            .subscribe({

                next: (response) => {

                    if (!response.success) {

                        this.errorMessage =
                            'Failed to load dashboard';

                        this.loading = false;

                        return;

                    }


                    const data =
                        response.data;


                    this.totalSales =
                        data.totalSales ?? 0;


                    this.totalOrders =
                        data.totalOrders ?? 0;


                    this.totalProducts =
                        data.totalProducts ?? 0;


                    this.totalCustomers =
                        data.totalCustomers ?? 0;


                    this.recentOrders =
                        data.recentOrders ?? [];


                    this.buildStats();


                    this.loading = false;

                },


                error: (error) => {

                    console.error(
                        'Dashboard API error:',
                        error
                    );


                    this.errorMessage =
                        error?.error?.message ||
                        'Unable to load dashboard. Please try again.';


                    this.loading = false;

                }

            });

    }


    // ========================================
    // BUILD STAT CARDS
    // ========================================

    private buildStats(): void {

        this.stats = [

            {
                title: 'Total Sales',

                value:
                    this.formatCurrency(
                        this.totalSales
                    ),

                icon: 'payments'
            },


            {
                title: 'Total Orders',

                value:
                    this.totalOrders.toLocaleString(),

                icon: 'shopping_bag'
            },


            {
                title: 'Products',

                value:
                    this.totalProducts.toLocaleString(),

                icon: 'inventory_2'
            },


            {
                title: 'Customers',

                value:
                    this.totalCustomers.toLocaleString(),

                icon: 'people'
            }

        ];

    }


    // ========================================
    // CURRENCY
    // ========================================

    formatCurrency(
        amount: number
    ): string {

        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }
        ).format(amount);

    }


    // ========================================
    // ORDER STATUS
    // ========================================

    getStatusLabel(
        status: string
    ): string {

        if (!status) {

            return 'Unknown';

        }


        return status
            .charAt(0)
            .toUpperCase() +
            status.slice(1);

    }


    // ========================================
    // STATUS CLASS
    // ========================================

    getStatusClass(
        status: string
    ): string {

        return status || '';

    }


    // ========================================
    // CUSTOMER NAME
    // ========================================

    getCustomerName(
        order: AdminDashboardOrder
    ): string {

        return (
            order.user?.name ||
            'Guest Customer'
        );

    }


    // ========================================
    // ORDER ID
    // ========================================

    getOrderId(
        order: AdminDashboardOrder
    ): string {

        return order._id
            ? `#${order._id.slice(-6).toUpperCase()} `
            : '#—';

    }


    // ========================================
    // RETRY
    // ========================================

    retry(): void {

        this.loadDashboard();

    }

}