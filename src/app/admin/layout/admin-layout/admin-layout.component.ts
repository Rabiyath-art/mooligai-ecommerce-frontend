import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

    private readonly authService = inject(AuthService);
    mobileMenuOpen = false;
    menuItems = [

        {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/admin/dashboard'
        },

        {
            label: 'Products',
            icon: 'inventory_2',
            route: '/admin/products'
        },

        {
            label: 'Categories',
            icon: 'category',
            route: '/admin/categories'
        },

        {
            label: 'Orders',
            icon: 'shopping_bag',
            route: '/admin/orders'
        },

        {
            label: 'Customers',
            icon: 'people',
            route: '/admin/customers'
        },

        {
            label: 'Settings',
            icon: 'settings',
            route: '/admin/settings'
        }

    ];

    toggleMobileMenu(): void {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen = false;
    }

    logout(): void {
        this.closeMobileMenu();
        this.authService.handleLogout();
    }
}
