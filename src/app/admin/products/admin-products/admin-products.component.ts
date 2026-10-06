import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AdminProductService } from '../../../core/services/admin-product.service';
import { Product } from '../../../core/models/product.model';
import { AdminProductDetailComponent } from '../admin-product-detail/admin-product-detail.component';
import { AdminProductCreateComponent } from '../admin-product-create/admin-product-create.component';
import { AdminProductEditComponent } from '../admin-product-edit/admin-product-edit.component';

@Component({
    selector: 'app-admin-products',
    imports: [CommonModule, FormsModule, MatIconModule, AdminProductDetailComponent, AdminProductCreateComponent, AdminProductEditComponent],
    templateUrl: './admin-products.component.html',
    styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {

    private readonly productService = inject(AdminProductService);
    products: Product[] = [];
    loading = false;
    errorMessage = '';
    searchTerm = '';
    statusFilter = '';
    stockFilter = '';
    sortFilter = '';
    currentPage = 1;
    limit = 10;
    total = 0;
    totalPages = 0;

    showDetailModal = false;
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;

    selectedProduct: Product | null = null;
    updatingProductId: string | null = null;
    deleting = false;

    get pageNumbers(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let page = start; page <= end; page++) {
            pages.push(page);
        }

        return pages;
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.errorMessage = '';

        this.productService.getProducts({
            search: this.searchTerm.trim() || undefined,
            status: this.statusFilter || undefined,
            stock: this.stockFilter || undefined,
            sort: this.sortFilter || undefined,
            page: this.currentPage, limit: this.limit
        }).subscribe({
            next: (response) => {
                this.products = response.data || [];
                if (response.pagination) {
                    this.total = response.pagination.total;
                    this.currentPage = response.pagination.page;
                    this.limit = response.pagination.limit;
                    this.totalPages = response.pagination.totalPages;
                }
                this.loading = false;
            },

            error: (error) => {
                console.error('Admin products error:', error);
                this.errorMessage = error.error?.message || 'Failed to load products';
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.currentPage = 1;
        this.loadProducts();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.applyFilters();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.statusFilter = '';
        this.stockFilter = '';
        this.sortFilter = '';
        this.currentPage = 1;
        this.loadProducts();
    }

    openDetail(product: Product): void {
        this.closeAllPopups();
        this.selectedProduct = product;
        this.showDetailModal = true;
    }

    closeDetail(): void {
        this.showDetailModal = false;
        this.selectedProduct = null;
    }

    openCreate(): void {
        this.closeAllPopups();
        this.selectedProduct = null;
        this.showCreateModal = true;
    }

    closeCreate(): void {
        this.showCreateModal = false;
    }

    onProductCreated(createdProduct?: Product): void {
        this.showCreateModal = false;
        this.selectedProduct = null;
        this.currentPage = 1;
        this.loadProducts();
    }

    openEdit(product: Product): void {
        this.showDetailModal = false;
        this.showCreateModal = false;
        this.showDeleteModal = false;
        this.selectedProduct = product;
        this.showEditModal = true;
    }

    closeEdit(): void {
        this.showEditModal = false;
        this.selectedProduct = null;
    }

    onProductUpdated(updatedProduct: Product): void {
        const index = this.products.findIndex(item => item._id === updatedProduct._id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
        }
        this.showEditModal = false;
        this.selectedProduct = null;
    }

    onProductStatusChanged(updatedProduct: Product): void {
        const index = this.products.findIndex(item => item._id === updatedProduct._id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
        }
        this.selectedProduct = updatedProduct;
    }


    openDelete(product: Product): void {
        this.closeAllPopups();
        this.selectedProduct = product;
        this.showDeleteModal = true;
    }

    closeDelete(): void {
        if (this.deleting) {
            return;
        }
        this.showDeleteModal = false;
        this.selectedProduct = null;
    }

    confirmDelete(): void {
        if (!this.selectedProduct || this.deleting) {
            return;
        }
        const product = this.selectedProduct;
        this.deleting = true;
        this.productService.deleteProduct(product._id).subscribe({
            next: () => {
                this.deleting = false;
                this.showDeleteModal = false;
                this.selectedProduct = null;

                if (this.products.length === 1 && this.currentPage > 1) {
                    this.currentPage--;
                }

                this.loadProducts();
            },

            error: (error) => {
                console.error('Delete product error:', error);
                this.deleting = false;
                alert(error.error?.message || 'Failed to delete product');

            }
        });

    }


    toggleStatus(product: Product): void {
        if (this.updatingProductId === product._id) {
            return;
        }


        const newStatus =
            !product.isActive;


        this.updatingProductId =
            product._id;


        this.productService
            .updateProductStatus(
                product._id,
                newStatus
            )
            .subscribe({

                next: (response) => {

                    console.log(
                        'Status updated:',
                        response
                    );


                    if (response.data) {

                        const index =
                            this.products.findIndex(
                                item =>
                                    item._id ===
                                    product._id
                            );


                        if (index !== -1) {

                            this.products[index] =
                                response.data;

                        }


                        if (
                            this.selectedProduct?._id ===
                            product._id
                        ) {

                            this.selectedProduct =
                                response.data;

                        }

                    }


                    this.updatingProductId =
                        null;

                },


                error: (error) => {

                    console.error(
                        'Status update error:',
                        error
                    );


                    this.updatingProductId =
                        null;


                    alert(
                        error.error?.message ||
                        'Failed to update status'
                    );

                }

            });

    }

    goToPage(page: number): void {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        this.currentPage = page;
        this.loadProducts();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadProducts();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadProducts();
        }
    }

    private closeAllPopups(): void {
        this.showDetailModal = false;
        this.showCreateModal = false;
        this.showEditModal = false;
        this.showDeleteModal = false;
    }

}