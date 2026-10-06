import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    RouterLink
} from '@angular/router';

import {
    OrderService
} from '../../core/services/order.service';

@Component({
    selector: 'app-user-order',
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './user-order.component.html',
    styleUrl: './user-order.component.scss'
})


export class OrdersComponent implements OnInit {

    private readonly orderService =
        inject(OrderService);


    orders: any[] = [];

    loading = false;

    errorMessage = '';


    ngOnInit(): void {

        this.loadOrders();

    }


    loadOrders(): void {

        this.loading = true;

        this.errorMessage = '';


        this.orderService
            .getMyOrders()
            .subscribe({

                next: (response) => {

                    this.orders =
                        response.data ?? [];

                    this.loading = false;

                },


                error: (error) => {

                    console.error(
                        'Unable to load orders:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ??
                        'Unable to load your orders.';

                    this.loading = false;

                }

            });

    }

}