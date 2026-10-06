import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  AdminProductService
} from '../../../core/services/admin-product.service';

import {
  Product
} from '../../../core/models/product.model';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-admin-product-detail',

  imports: [
    CommonModule,
    MatIconModule,
    MatIcon
  ],

  templateUrl:
    './admin-product-detail.component.html',

  styleUrl:
    './admin-product-detail.component.scss'
})
export class AdminProductDetailComponent {


  // ========================================
  // SERVICE
  // ========================================

  private readonly productService =
    inject(AdminProductService);



  // ========================================
  // INPUT
  // ========================================

  @Input()
  product!: Product;



  // ========================================
  // OUTPUTS
  // ========================================

  @Output()
  close =
    new EventEmitter<void>();


  @Output()
  edit =
    new EventEmitter<Product>();


  @Output()
  statusChanged =
    new EventEmitter<Product>();


  @Output()
  delete =
    new EventEmitter<Product>();



  // ========================================
  // STATUS LOADING
  // ========================================

  updatingStatus =
    false;



  // ========================================
  // CLOSE
  // ========================================

  closeModal(): void {

    this.close.emit();

  }



  // ========================================
  // EDIT
  // ========================================

  editProduct(): void {

    if (!this.product) {

      return;

    }


    this.edit.emit(
      this.product
    );

  }



  // ========================================
  // DELETE
  // ========================================

  deleteProduct(): void {

    if (!this.product) {

      return;

    }


    this.delete.emit(
      this.product
    );

  }



  // ========================================
  // TOGGLE STATUS
  // ========================================

  toggleStatus(): void {

    if (
      !this.product ||
      this.updatingStatus
    ) {

      return;

    }


    const newStatus =
      !this.product.isActive;


    this.updatingStatus =
      true;


    this.productService
      .updateProductStatus(
        this.product._id,
        newStatus
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Detail status updated:',
            response
          );


          if (response.data) {

            /*
             * Update popup.
             */

            this.product =
              response.data;


            /*
             * Update parent table.
             */

            this.statusChanged.emit(
              response.data
            );

          }


          this.updatingStatus =
            false;

        },


        error: (error) => {

          console.error(
            'Status update error:',
            error
          );


          this.updatingStatus =
            false;


          alert(
            error.error?.message ||
            'Failed to update status'
          );

        }

      });

  }

}