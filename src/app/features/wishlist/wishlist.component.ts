import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-wishlist',

    imports: [
        CommonModule,
        RouterLink
    ],

    templateUrl: './wishlist.component.html',

    styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

    private readonly wishlistService =
        inject(WishlistService);

    products: Product[] = [];

    loading = false;

    errorMessage = '';


    ngOnInit(): void {

        this.loadWishlist();

    }


    loadWishlist(): void {

        this.loading = true;

        this.wishlistService.getWishlist().subscribe({

            next: response => {

                if (response.success) {

                    this.products =
                        response.data.products;

                    this.wishlistService.updateWishlistCount(
                        response.data
                    );

                }

                this.loading = false;

            },

            error: error => {

                console.error(
                    'Failed to load wishlist:',
                    error
                );

                this.errorMessage =
                    'Unable to load wishlist.';

                this.loading = false;

            }

        });

    }


    removeFromWishlist(product: Product): void {

        this.wishlistService
            .toggleWishlist(product._id)
            .subscribe({

                next: response => {

                    if (response.success) {

                        this.products =
                            response.data.products;

                        this.wishlistService
                            .updateWishlistCount(
                                response.data
                            );

                    }

                },

                error: error => {

                    console.error(
                        'Remove wishlist failed:',
                        error
                    );

                }

            });

    }

}