import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
    selector: 'app-navbar',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatIconModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

    private readonly authService = inject(AuthService);
    private readonly cartService = inject(CartService);
    private readonly wishlistService = inject(WishlistService);

    isLoggedIn = false;
    userMenuOpen = false;
    mobileMenuOpen = false;

    cartCount = 0;
    wishlistCount = 0;


    ngOnInit(): void {

        // ================================
        // LOGIN STATE
        // ================================

        this.authService.isLoggedIn$.subscribe(loggedIn => {

            this.isLoggedIn = loggedIn;

            if (loggedIn) {
                this.loadCartCount();
                this.loadWishlistCount();
            } else {
                this.cartCount = 0;
                this.wishlistCount = 0;
            }

        });


        // ================================
        // CART COUNT
        // ================================

        this.cartService.cartCount$.subscribe(count => {

            this.cartCount = count;

        });


        // ================================
        // WISHLIST COUNT
        // ================================

        this.wishlistService.wishlistCount$.subscribe(count => {

            this.wishlistCount = count;

        });

    }


    // ==========================================
    // INITIAL CART COUNT
    // ==========================================

    private loadCartCount(): void {

        this.cartService.getCart().subscribe({

            next: response => {

                if (response.success) {

                    this.cartService.updateCartCount(
                        response.data
                    );

                }

            },

            error: error => {

                console.error(
                    'Failed to load cart count:',
                    error
                );

                this.cartCount = 0;

            }

        });

    }


    // ==========================================
    // INITIAL WISHLIST COUNT
    // ==========================================

    private loadWishlistCount(): void {

        this.wishlistService.getWishlist().subscribe({

            next: response => {

                if (response.success) {

                    this.wishlistService.updateWishlistCount(
                        response.data
                    );

                }

            },

            error: error => {

                console.error(
                    'Failed to load wishlist count:',
                    error
                );

                this.wishlistCount = 0;

            }

        });

    }


    // ==========================================
    // MOBILE MENU
    // ==========================================

    toggleMobileMenu(): void {

        this.mobileMenuOpen = !this.mobileMenuOpen;

        if (this.mobileMenuOpen) {
            this.userMenuOpen = false;
        }

    }


    closeMobileMenu(): void {

        this.mobileMenuOpen = false;

    }


    // ==========================================
    // USER MENU
    // ==========================================

    toggleUserMenu(): void {

        this.userMenuOpen = !this.userMenuOpen;

    }


    closeUserMenu(): void {

        this.userMenuOpen = false;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    logout(): void {

        this.userMenuOpen = false;
        this.mobileMenuOpen = false;

        this.authService.handleLogout();

    }


    // ==========================================
    // OUTSIDE CLICK
    // ==========================================

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {

        const target = event.target as HTMLElement;

        if (!target.closest('.mg-user-dropdown')) {

            this.userMenuOpen = false;

        }

    }

}