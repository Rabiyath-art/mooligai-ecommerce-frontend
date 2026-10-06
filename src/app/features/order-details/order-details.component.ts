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
  OrderService
} from './../../core/services/order.service';

import {
  Order
} from './../../core/models/order.model';

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


  private readonly orderService =
    inject(OrderService);


  order: Order | null = null;


  loading = false;


  errorMessage = '';


  // =====================================================
  // INIT
  // =====================================================

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


  // =====================================================
  // LOAD ORDER
  // =====================================================

  loadOrder(
    orderId: string
  ): void {

    this.loading = true;

    this.errorMessage = '';


    this.orderService
      .getOrderById(orderId)
      .subscribe({

        next: (response) => {

          this.order =
            response.data;

          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load order:',
            error
          );

          this.errorMessage =
            error?.error?.message ??
            'Unable to load order.';

          this.loading = false;

        }

      });

  }


  // =====================================================
  // DATE
  // =====================================================

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


  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  getTotalItems(): number {

    if (!this.order) {

      return 0;

    }


    return this.order.items.reduce(
      (
        total,
        item
      ) => total + item.quantity,
      0
    );

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: string
  ): string {

    return `status-${status}`;

  }


  // =====================================================
  // PAYMENT STATUS CLASS
  // =====================================================

  getPaymentStatusClass(
    status: string
  ): string {

    return `payment-${status}`;

  }


  // =====================================================
  // TRACKING
  // =====================================================

  isStatusCompleted(
    status: string
  ): boolean {

    if (!this.order) {

      return false;

    }


    const statuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered'
    ];


    const currentIndex =
      statuses.indexOf(
        this.order.orderStatus
      );


    const statusIndex =
      statuses.indexOf(status);


    return statusIndex <= currentIndex;

  }


  // =====================================================
  // CURRENT STATUS
  // =====================================================

  isCurrentStatus(
    status: string
  ): boolean {

    return this.order?.orderStatus === status;

  }
}
