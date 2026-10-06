import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  AdminCustomerService
} from '../../../core/services/admin-customer.service';

import {
  Customer
} from '../../../core/models/customer.model';

@Component({
  selector: 'app-admin-customers',
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.scss'
})
export class AdminCustomersComponent implements OnInit {
  private readonly customerService =
    inject(AdminCustomerService);


  private readonly router =
    inject(Router);


  // =====================================================
  // DATA
  // =====================================================

  customers: Customer[] = [];


  loading = false;


  errorMessage = '';


  // =====================================================
  // SEARCH
  // =====================================================

  search = '';


  status = '';


  sort = '';


  // =====================================================
  // PAGINATION
  // =====================================================

  page = 1;


  limit = 10;


  total = 0;


  totalPages = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadCustomers();

  }


  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  loadCustomers(): void {

    this.loading = true;

    this.errorMessage = '';


    this.customerService
      .getCustomers(
        this.search,
        this.status,
        this.page,
        this.limit,
        this.sort
      )
      .subscribe({

        next: (response) => {

          this.customers =
            response.data ?? [];


          this.total =
            response.pagination?.total ?? 0;


          this.page =
            response.pagination?.page ?? 1;


          this.limit =
            response.pagination?.limit ?? 10;


          this.totalPages =
            response.pagination?.totalPages ?? 0;


          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Customer loading failed:',
            error
          );


          this.errorMessage =
            error?.error?.message ??
            'Unable to load customers.';


          this.loading = false;

        }

      });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  searchCustomers(): void {

    this.page = 1;

    this.loadCustomers();

  }


  // =====================================================
  // STATUS
  // =====================================================

  onStatusChange(): void {

    this.page = 1;

    this.loadCustomers();

  }


  // =====================================================
  // SORT
  // =====================================================

  onSortChange(): void {

    this.page = 1;

    this.loadCustomers();

  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  clearFilters(): void {

    this.search = '';

    this.status = '';

    this.sort = '';

    this.page = 1;

    this.loadCustomers();

  }


  // =====================================================
  // VIEW CUSTOMER
  // =====================================================

  viewCustomer(
    customer: Customer
  ): void {

    this.router.navigate([
      '/admin/customers',
      customer._id
    ]);

  }


  // =====================================================
  // STATUS UPDATE
  // =====================================================

  toggleCustomerStatus(
    customer: Customer
  ): void {

    const newStatus =
      !customer.isActive;


    this.customerService
      .updateCustomerStatus(
        customer._id,
        newStatus
      )
      .subscribe({

        next: (response) => {

          customer.isActive =
            response.data.isActive;

        },


        error: (error) => {

          console.error(
            'Customer status update failed:',
            error
          );

        }

      });

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.page
    ) {

      return;

    }


    this.page = page;

    this.loadCustomers();

  }


  // =====================================================
  // PREVIOUS
  // =====================================================

  previousPage(): void {

    this.goToPage(
      this.page - 1
    );

  }


  // =====================================================
  // NEXT
  // =====================================================

  nextPage(): void {

    this.goToPage(
      this.page + 1
    );

  }


  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  get pages(): number[] {

    return Array.from(
      {
        length: this.totalPages
      },
      (_, index) =>
        index + 1
    );

  }


  // =====================================================
  // TRACK
  // =====================================================

  trackByCustomer(
    index: number,
    customer: Customer
  ): string {

    return customer._id;

  }
}
