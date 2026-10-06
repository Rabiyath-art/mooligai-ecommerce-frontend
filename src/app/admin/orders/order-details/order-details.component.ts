import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    ActivatedRoute,
    RouterLink
} from '@angular/router';

import {
    AdminOrderService
} from '../../../core/services/admin-order.service';

import {
    AdminOrder
} from '../../../core/models/admin-order.model';

@Component({
    selector: 'app-order-details',
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './order-details.component.html',
    styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {
    private readonly route =
        inject(ActivatedRoute);


    private readonly adminOrderService =
        inject(AdminOrderService);


    order: AdminOrder | null = null;


    loading = false;


    updatingStatus = false;


    errorMessage = '';


    successMessage = '';


    // ==========================================
    // STATUS OPTIONS
    // ==========================================

    statuses: AdminOrder['orderStatus'][] = [

        'pending',

        'confirmed',

        'processing',

        'shipped',

        'delivered',

        'cancelled'

    ];


    // ==========================================
    // INIT
    // ==========================================

    ngOnInit(): void {

        const orderId =
            this.route.snapshot.paramMap.get('id');


        if (!orderId) {

            this.errorMessage =
                'Order ID is missing.';

            return;

        }


        this.loadOrder(orderId);

    }


    // ==========================================
    // LOAD ORDER
    // ==========================================

    loadOrder(
        orderId: string
    ): void {

        this.loading = true;

        this.errorMessage = '';

        this.successMessage = '';


        this.adminOrderService
            .getOrderById(orderId)
            .subscribe({

                next: (response) => {

                    this.order =
                        response.data;

                    this.loading = false;

                },


                error: (error) => {

                    console.error(
                        'Failed to load admin order',
                        error
                    );


                    this.errorMessage =
                        error?.error?.message ||
                        'Unable to load order.';


                    this.loading = false;

                }

            });

    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    updateStatus(
        status: AdminOrder['orderStatus']
    ): void {

        if (!this.order) {
            return;
        }


        if (
            status ===
            this.order.orderStatus
        ) {

            return;

        }


        this.updatingStatus = true;

        this.errorMessage = '';

        this.successMessage = '';


        this.adminOrderService
            .updateOrderStatus(
                this.order._id,
                status
            )
            .subscribe({

                next: (response) => {

                    this.order =
                        response.data;


                    this.successMessage =
                        response.message;


                    this.updatingStatus = false;

                },


                error: (error) => {

                    console.error(
                        'Failed to update order status',
                        error
                    );


                    this.errorMessage =
                        error?.error?.message ||
                        'Unable to update order status.';


                    this.updatingStatus = false;

                }

            });

    }


    // ==========================================
    // DATE
    // ==========================================

    formatDate(
        date: string
    ): string {

        return new Date(date)
            .toLocaleDateString(
                'en-IN',
                {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }
            );

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

    getTotalItems(): number {

        if (!this.order) {

            return 0;

        }


        return this.order.items.reduce(
            (
                total,
                item
            ) =>
                total + item.quantity,
            0
        );

    }
}
