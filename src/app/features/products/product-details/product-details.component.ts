import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
    selector: 'app-product-details',
    imports: [CommonModule, RouterLink],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
    private readonly route =
        inject(ActivatedRoute);

    private readonly productService =
        inject(ProductService);

    private readonly cartService =
        inject(CartService);

    private readonly wishlistService =
        inject(WishlistService);


    product: Product | null = null;

    selectedImage = '';

    quantity = 1;

    loading = false;

    addingToCart = false;

    errorMessage = '';

    successMessage = '';


    ngOnInit(): void {

        const productId =
            this.route.snapshot.paramMap.get(
                'id'
            );

        if (!productId) {

            this.errorMessage =
                'Invalid product.';

            return;

        }

        this.loadProduct(productId);

    }


    loadProduct(
        productId: string
    ): void {

        this.loading = true;

        this.productService
            .getProductById(productId)
            .subscribe({

                next: (response) => {

                    this.product =
                        response.data;

                    this.selectedImage =
                        this.product.images?.[0] ?? '';

                    this.loading = false;

                },

                error: (error) => {

                    console.error(error);

                    this.errorMessage =
                        'Unable to load product.';

                    this.loading = false;

                }

            });

    }


    selectImage(
        image: string
    ): void {

        this.selectedImage = image;

    }


    increaseQuantity(): void {

        if (!this.product) {
            return;
        }

        if (
            this.quantity <
            this.product.stock
        ) {

            this.quantity++;

        }

    }


    decreaseQuantity(): void {

        if (this.quantity > 1) {

            this.quantity--;

        }

    }


    addToCart(): void {

        if (!this.product) {
            return;
        }

        if (this.product.stock <= 0) {
            return;
        }

        this.addingToCart = true;

        this.successMessage = '';

        this.cartService
            .addToCart(
                this.product._id,
                this.quantity
            )
            .subscribe({

                next: (response) => {

                    this.cartService
                        .updateCartCount(
                            response.data
                        );

                    this.successMessage =
                        'Product added to cart.';

                    this.addingToCart = false;

                },

                error: (error) => {

                    console.error(error);

                    this.errorMessage =
                        'Unable to add product to cart.';

                    this.addingToCart = false;

                }

            });

    }


    addToWishlist(): void {

        if (!this.product) {
            return;
        }

        this.wishlistService.toggleWishlist(
            this.product._id
        ).subscribe({

            next: response => {

                if (response.success) {

                    this.wishlistService.updateWishlistCount(
                        response.data
                    );

                }

            },

            error: error => {

                console.error(
                    'Wishlist failed:',
                    error
                );

            }

        });

    }
}
