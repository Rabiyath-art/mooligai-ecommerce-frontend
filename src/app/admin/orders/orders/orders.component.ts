import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    RouterLink
} from '@angular/router';

import {
    FormsModule
} from '@angular/forms';

import {
    AdminOrderService
} from '../../../core/services/admin-order.service';

import {
    AdminOrder
} from '../../../core/models/admin-order.model';

@Component({
    selector: 'app-orders',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
    private readonly adminOrderService =
        inject(AdminOrderService);


    orders: AdminOrder[] = [];


    loading = false;


    errorMessage = '';


    // ==========================================
    // SEARCH / FILTER
    // ==========================================

    search = '';

    paymentStatus = '';

    orderStatus = '';

    sort = '';


    // ==========================================
    // PAGINATION
    // ==========================================

    currentPage = 1;

    pageSize = 10;

    totalOrders = 0;

    totalPages = 0;


    // ==========================================
    // INIT
    // ==========================================

    ngOnInit(): void {

        this.loadOrders();

    }


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    loadOrders(): void {

        this.loading = true;

        this.errorMessage = '';


        this.adminOrderService
            .getOrders(
                this.search,
                this.paymentStatus,
                this.orderStatus,
                this.sort,
                this.currentPage,
                this.pageSize
            )
            .subscribe({

                next: (response) => {

                    this.orders =
                        response.data || [];


                    this.totalOrders =
                        response.pagination?.total || 0;


                    this.totalPages =
                        response.pagination?.totalPages || 0;


                    this.loading = false;

                },


                error: (error) => {

                    console.error(
                        'Failed to load admin orders',
                        error
                    );


                    this.errorMessage =
                        error?.error?.message ||
                        'Unable to load orders.';


                    this.loading = false;

                }

            });

    }


    // ==========================================
    // SEARCH
    // ==========================================

    onSearch(): void {

        this.currentPage = 1;

        this.loadOrders();

    }


    // ==========================================
    // FILTER
    // ==========================================

    onFilterChange(): void {

        this.currentPage = 1;

        this.loadOrders();

    }


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    clearFilters(): void {

        this.search = '';

        this.paymentStatus = '';

        this.orderStatus = '';

        this.sort = '';

        this.currentPage = 1;

        this.loadOrders();

    }


    // ==========================================
    // PAGINATION
    // ==========================================

    goToPage(
        page: number
    ): void {

        if (
            page < 1 ||
            page > this.totalPages ||
            page === this.currentPage
        ) {

            return;

        }


        this.currentPage = page;

        this.loadOrders();

    }


    // ==========================================
    // STATUS CLASS
    // ==========================================

    getStatusClass(
        status: string
    ): string {

        return `status-${status}`;

    }


    // ==========================================
    // PAYMENT CLASS
    // ==========================================

    getPaymentStatusClass(
        status: string
    ): string {

        return `payment-${status}`;

    }


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    getTotalItems(
        order: AdminOrder
    ): number {

        return order.items.reduce(
            (
                total,
                item
            ) =>
                total + item.quantity,
            0
        );

    }


    // ==========================================
    // PAGE NUMBERS
    // ==========================================

    getPages(): number[] {

        return Array.from(
            {
                length: this.totalPages
            },
            (_, index) => index + 1
        );

    }
}
