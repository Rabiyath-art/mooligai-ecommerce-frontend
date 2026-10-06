import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../core/models/product.model';

import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
    selector: 'app-products',
    imports: [
        CommonModule,
        FormsModule,
        ProductCardComponent
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

    private readonly productService =
        inject(ProductService);

    private readonly cartService =
        inject(CartService);

    private readonly wishlistService =
        inject(WishlistService);


    products: Product[] = [];

    wishlistProductIds =
        new Set<string>();


    search = '';

    selectedCategory = '';

    sort = '';

    minPrice?: number;

    maxPrice?: number;

    page = 1;

    limit = 12;

    totalPages = 1;

    loading = false;

    errorMessage = '';


    ngOnInit(): void {

        this.loadProducts();

        this.loadWishlist();

    }


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    loadProducts(): void {

        this.loading = true;

        this.productService.getProducts({

            search: this.search,

            category: this.selectedCategory,

            minPrice: this.minPrice,

            maxPrice: this.maxPrice,

            sort: this.sort,

            page: this.page,

            limit: this.limit

        }).subscribe({

            next: response => {

                this.products =
                    response.data;

                this.totalPages =
                    response.pagination.totalPages;

                this.loading = false;

            },

            error: error => {

                console.error(error);

                this.errorMessage =
                    'Unable to load products.';

                this.loading = false;

            }

        });

    }


    // ==========================================
    // LOAD WISHLIST
    // ==========================================

    private loadWishlist(): void {

        this.wishlistService.getWishlist().subscribe({

            next: response => {

                if (response.success) {

                    this.wishlistProductIds =
                        new Set(
                            response.data.products.map(
                                product => product._id
                            )
                        );

                    this.wishlistService.updateWishlistCount(
                        response.data
                    );

                }

            },

            error: error => {

                console.error(
                    'Failed to load wishlist:',
                    error
                );

            }

        });

    }


    // ==========================================
    // SEARCH
    // ==========================================

    searchProducts(): void {

        this.page = 1;

        this.loadProducts();

    }


    // ==========================================
    // PAGINATION
    // ==========================================

    changePage(page: number): void {

        if (
            page < 1 ||
            page > this.totalPages
        ) {

            return;

        }

        this.page = page;

        this.loadProducts();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    addToCart(product: Product): void {

        this.cartService
            .addToCart(product._id)
            .subscribe({

                next: response => {

                    this.cartService.updateCartCount(
                        response.data
                    );

                    console.log(
                        'Product added to cart'
                    );

                },

                error: error => {

                    console.error(
                        'Add to cart failed',
                        error
                    );

                }

            });

    }


    // ==========================================
    // TOGGLE WISHLIST
    // ==========================================

    toggleWishlist(product: Product): void {

        console.log(
            'Wishlist clicked:',
            product._id
        );

        this.wishlistService
            .toggleWishlist(product._id)
            .subscribe({

                next: response => {

                    console.log(
                        'Wishlist API response:',
                        response
                    );

                    if (response.success) {

                        // Update heart state
                        this.wishlistProductIds =
                            new Set(
                                response.data.products.map(
                                    product => product._id
                                )
                            );


                        // Update navbar count
                        this.wishlistService
                            .updateWishlistCount(
                                response.data
                            );

                    }

                },

                error: error => {

                    console.error(
                        'Wishlist API ERROR:',
                        error
                    );

                }

            });

    }

}