import {
    Component,
    OnInit,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    FormsModule
} from '@angular/forms';

import {
    Router
} from '@angular/router';

import {
    MatIconModule
} from '@angular/material/icon';

import {
    Category
} from '../../../core/models/category.model';

import {
    CategoryService
} from '../../../core/services/category.service';

import {
    AdminCategoryCreateComponent
} from '../admin-category-create/admin-category-create.component';

import {
    AdminCategoryEditComponent
} from '../admin-category-edit/admin-category-edit.component';

@Component({
    selector: 'app-admin-categories',
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        AdminCategoryCreateComponent,
        AdminCategoryEditComponent
    ],
    templateUrl: './admin-categories.component.html',
    styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit {
    private readonly categoryService =
        inject(CategoryService);

    private readonly router =
        inject(Router);


    categories: Category[] = [];


    search = '';

    status = '';


    page = 1;

    limit = 10;


    total = 0;

    totalPages = 0;


    loading = false;

    errorMessage = '';

    successMessage = '';


    // =====================================================
    // POPUP
    // =====================================================

    showCreateModal = false;

    showEditModal = false;

    selectedCategory: Category | null = null;


    ngOnInit(): void {

        this.loadCategories();

    }


    // =====================================================
    // LOAD
    // =====================================================

    loadCategories(): void {

        this.loading = true;

        this.errorMessage = '';


        this.categoryService
            .getAdminCategories(
                this.search,
                this.status,
                this.page,
                this.limit
            )
            .subscribe({

                next: (response) => {

                    this.categories =
                        response.data;

                    this.total =
                        response.pagination.total;

                    this.page =
                        response.pagination.page;

                    this.limit =
                        response.pagination.limit;

                    this.totalPages =
                        response.pagination.totalPages;

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Category loading error:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ||
                        'Failed to load categories.';

                    this.loading = false;

                }

            });

    }


    // =====================================================
    // SEARCH
    // =====================================================

    onSearch(): void {

        this.page = 1;

        this.loadCategories();

    }


    // =====================================================
    // STATUS FILTER
    // =====================================================

    onStatusChange(): void {

        this.page = 1;

        this.loadCategories();

    }


    // =====================================================
    // CLEAR FILTER
    // =====================================================

    clearFilters(): void {

        this.search = '';

        this.status = '';

        this.page = 1;

        this.loadCategories();

    }


    // =====================================================
    // CREATE POPUP
    // =====================================================

    createCategory(): void {

        this.selectedCategory = null;

        this.showCreateModal = true;

    }


    // =====================================================
    // CLOSE CREATE
    // =====================================================

    closeCreateModal(): void {

        this.showCreateModal = false;

    }


    // =====================================================
    // CREATE SUCCESS
    // =====================================================

    onCategoryCreated(
        category: Category
    ): void {

        this.showCreateModal = false;

        this.successMessage =
            'Category created successfully.';

        this.loadCategories();

        setTimeout(() => {

            this.successMessage = '';

        }, 3000);

    }


    // =====================================================
    // DETAIL
    // =====================================================

    viewCategory(
        category: Category
    ): void {

        this.router.navigate([
            '/admin/categories',
            category._id
        ]);

    }


    // =====================================================
    // EDIT POPUP
    // =====================================================

    editCategory(
        category: Category
    ): void {

        this.selectedCategory =
            category;

        this.showEditModal = true;

    }


    // =====================================================
    // CLOSE EDIT
    // =====================================================

    closeEditModal(): void {

        this.showEditModal = false;

        this.selectedCategory = null;

    }


    // =====================================================
    // UPDATE SUCCESS
    // =====================================================

    onCategoryUpdated(
        category: Category
    ): void {

        this.showEditModal = false;

        this.selectedCategory = null;

        this.successMessage =
            'Category updated successfully.';

        this.loadCategories();

        setTimeout(() => {

            this.successMessage = '';

        }, 3000);

    }


    // =====================================================
    // STATUS
    // =====================================================

    toggleStatus(
        category: Category
    ): void {

        const newStatus =
            !category.isActive;


        this.categoryService
            .updateCategoryStatus(
                category._id,
                newStatus
            )
            .subscribe({

                next: (response) => {

                    category.isActive =
                        response.data.isActive;

                    this.successMessage =
                        'Category status updated successfully.';

                    setTimeout(() => {

                        this.successMessage = '';

                    }, 3000);

                },

                error: (error) => {

                    console.error(
                        'Status update error:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ||
                        'Failed to update category status.';

                }

            });

    }


    // =====================================================
    // DELETE
    // =====================================================

    deleteCategory(
        category: Category
    ): void {

        const confirmed =
            window.confirm(
                `Are you sure you want to deactivate "${category.name}"?`
            );


        if (!confirmed) {

            return;

        }


        this.categoryService
            .deleteCategory(
                category._id
            )
            .subscribe({

                next: () => {

                    this.successMessage =
                        'Category deleted successfully.';

                    this.loadCategories();

                    setTimeout(() => {

                        this.successMessage = '';

                    }, 3000);

                },

                error: (error) => {

                    console.error(
                        'Delete category error:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ||
                        'Failed to delete category.';

                }

            });

    }


    // =====================================================
    // PAGINATION
    // =====================================================

    previousPage(): void {

        if (this.page <= 1) {

            return;

        }


        this.page--;

        this.loadCategories();

    }


    nextPage(): void {

        if (
            this.page >=
            this.totalPages
        ) {

            return;

        }


        this.page++;

        this.loadCategories();

    }


    goToPage(
        pageNumber: number
    ): void {

        if (
            pageNumber < 1 ||
            pageNumber > this.totalPages
        ) {

            return;

        }


        this.page =
            pageNumber;

        this.loadCategories();

    }


    get pages(): number[] {

        return Array.from(
            {
                length: this.totalPages
            },
            (_, index) =>
                index + 1
        );

    }
}
