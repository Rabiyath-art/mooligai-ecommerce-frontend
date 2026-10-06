import { Routes } from '@angular/router';

import { authGuard } from './core/guard/auth.guard';
import { adminGuard } from './core/guard/admin.guard';

import { AdminProductsComponent }
    from './admin/products/admin-products/admin-products.component';

export const routes: Routes = [

    // =====================================================
    // PUBLIC
    // =====================================================

    {
        path: '',

        loadComponent: () =>
            import(
                './features/home/home.component'
            ).then(
                m => m.HomeComponent
            )
    },


    {
        path: 'products',

        loadComponent: () =>
            import(
                './features/products/products.component'
            ).then(
                m => m.ProductsComponent
            )
    },


    {
        path: 'products/:id',

        loadComponent: () =>
            import(
                './features/products/product-details/product-details.component'
            ).then(
                m => m.ProductDetailsComponent
            )
    },


    {
        path: 'cart',

        canActivate: [authGuard],

        loadComponent: () =>
            import(
                './features/cart/cart.component'
            ).then(
                m => m.CartComponent
            )
    },

    {
        path: 'wishlist',

        canActivate: [authGuard],

        loadComponent: () =>
            import(
                './features/wishlist/wishlist.component'
            ).then(
                m => m.WishlistComponent
            )
    },

    {
        path: 'login',

        loadComponent: () =>
            import(
                './features/auth/login/login.component'
            ).then(
                m => m.LoginComponent
            )
    },


    {
        path: 'checkout',

        canActivate: [authGuard],

        loadComponent: () =>
            import(
                './features/checkout/checkout.component'
            ).then(
                m => m.CheckoutComponent
            )
    },

    {
        path: 'orders',

        canActivate: [authGuard],

        loadComponent: () =>
            import(
                './features/user-order/user-order.component'
            ).then(
                m => m.OrdersComponent
            )
    },

    {
        path: 'orders/:id',

        canActivate: [authGuard],

        loadComponent: () =>
            import(
                './features/order-details/order-details.component'
            ).then(
                m => m.OrderDetailsComponent
            )
    },

    // =====================================================
    // ADMIN
    // =====================================================

    {
        path: 'admin',

        canActivate: [
            authGuard,
            adminGuard
        ],

        loadComponent: () =>
            import(
                './admin/layout/admin-layout/admin-layout.component'
            ).then(
                m => m.AdminLayoutComponent
            ),

        children: [

            // ===============================================
            // DEFAULT
            // ===============================================

            {
                path: '',

                redirectTo: 'dashboard',

                pathMatch: 'full'
            },


            // ===============================================
            // DASHBOARD
            // ===============================================

            {
                path: 'dashboard',

                loadComponent: () =>
                    import(
                        './admin/dashboard/admin-dashboard/admin-dashboard.component'
                    ).then(
                        m => m.AdminDashboardComponent
                    )
            },


            // ===============================================
            // PRODUCTS
            //
            // ONLY THIS ROUTE
            //
            // /admin/products
            //
            // Create / Detail / Edit are POPUPS
            // ===============================================

            {
                path: 'products',

                component: AdminProductsComponent
            },


            // ===============================================
            // CATEGORIES
            // ===============================================

            {
                path: 'categories',

                loadComponent: () =>
                    import(
                        './admin/categories/admin-categories/admin-categories.component'
                    ).then(
                        m => m.AdminCategoriesComponent
                    )
            },

            {
                path: 'categories/:id',

                loadComponent: () =>
                    import(
                        './admin/categories/admin-category-detail/admin-category-detail.component'
                    ).then(
                        m => m.AdminCategoryDetailComponent
                    )
            },

            // ===============================================
            // ORDERS
            // ===============================================

            {
                path: 'orders',
                canActivate: [authGuard],
                loadComponent: () =>
                    import(
                        './admin/orders/orders/orders.component'
                    ).then(
                        m => m.OrdersComponent
                    )
            },

            {
                path: 'orders/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import(
                        './admin/orders/order-details/order-details.component'
                    ).then(
                        m => m.OrderDetailsComponent
                    )
            },


            // ===============================================
            // CUSTOMERS
            // ===============================================

            {
                path: 'customers',

                loadComponent: () =>
                    import(
                        './admin/customers/admin-customers/admin-customers.component'
                    ).then(
                        m => m.AdminCustomersComponent
                    )
            },

            {
                path: 'customers/:id',

                loadComponent: () =>
                    import(
                        './admin/customers/admin-customer-detail/admin-customer-detail.component'
                    ).then(
                        m => m.AdminCustomerDetailComponent
                    )
            },

        ]
    },


    // =====================================================
    // FALLBACK
    // =====================================================

    {
        path: '**',

        redirectTo: ''
    }

];