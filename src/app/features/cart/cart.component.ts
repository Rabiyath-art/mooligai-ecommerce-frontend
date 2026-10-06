import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

    private readonly cartService = inject(CartService);
    cart: Cart | null = null;
    loading = false;
    errorMessage = '';

    ngOnInit(): void {
        this.loadCart();
    }


    loadCart(): void {
        this.loading = true;
        this.cartService.getCart().subscribe({
            next: (response) => {
                this.cart = response.data;
                this.cartService.updateCartCount(response.data);
                this.loading = false;
            },

            error: (error) => {
                console.error(error);
                this.errorMessage = 'Unable to load cart.';
                this.loading = false;
            }
        });
    }

    increaseQuantity(productId: string, currentQuantity: number): void {
        this.updateQuantity(productId, currentQuantity + 1);
    }

    decreaseQuantity(productId: string, currentQuantity: number): void {
        if (currentQuantity <= 1) {
            return;
        }
        this.updateQuantity(productId, currentQuantity - 1);
    }

    updateQuantity(productId: string, quantity: number): void {
        this.cartService.updateQuantity(
            productId,
            quantity
        ).subscribe({

            next: response => {

                if (response.success) {

                    this.cart = response.data;

                    this.cartService.updateCartCount(
                        response.data
                    );

                }

            }

        });
    }


    removeItem(productId: string): void {
        this.cartService.removeFromCart(productId).subscribe({

            next: response => {

                if (response.success) {

                    this.cart = response.data;

                    this.cartService.updateCartCount(
                        response.data
                    );

                }

            }

        });
    }


    clearCart(): void {
        this.cartService.clearCart().subscribe({

            next: response => {

                if (response.success) {

                    this.cart = response.data;

                    this.cartService.updateCartCount(
                        response.data
                    );

                }

            }

        });
    }
}
