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
  AdminCustomerService
} from '../../../core/services/admin-customer.service';

import {
  CustomerDetailResponse,
  CustomerOrder
} from '../../../core/models/customer.model';

@Component({
  selector: 'app-admin-customer-detail',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './admin-customer-detail.component.html',
  styleUrl: './admin-customer-detail.component.scss'
})
export class AdminCustomerDetailComponent implements OnInit {
  private readonly route =
    inject(ActivatedRoute);


  private readonly customerService =
    inject(AdminCustomerService);


  customer: any = null;


  statistics = {

    totalOrders: 0,

    paidOrders: 0,

    totalSpent: 0

  };


  orders: CustomerOrder[] = [];


  loading = false;


  errorMessage = '';


  ngOnInit(): void {

    const customerId =
      this.route.snapshot.paramMap.get('id');


    if (!customerId) {

      this.errorMessage =
        'Customer ID is missing.';

      return;

    }


    this.loadCustomer(
      customerId
    );

  }


  loadCustomer(
    id: string
  ): void {

    this.loading = true;

    this.errorMessage = '';


    this.customerService
      .getCustomerById(id)
      .subscribe({

        next: (
          response: CustomerDetailResponse
        ) => {

          this.customer =
            response.data.customer;


          this.statistics =
            response.data.statistics;


          this.orders =
            response.data.orders ?? [];


          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Customer detail error:',
            error
          );


          this.errorMessage =
            error?.error?.message ??
            'Unable to load customer.';


          this.loading = false;

        }

      });

  }


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


  getOrderStatus(
    order: CustomerOrder
  ): string {

    return (
      order.orderStatus ??
      order.status ??
      'pending'
    );

  }


  getStatusClass(
    status: string
  ): string {

    return `status-${status}`;

  }
}
