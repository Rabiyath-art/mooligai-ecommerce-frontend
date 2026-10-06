import {
    Component,
    EventEmitter,
    Output,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    FormsModule
} from '@angular/forms';

import {
    MatIconModule
} from '@angular/material/icon';

import {
    Category
} from '../../../core/models/category.model';

import {
    CategoryService
} from '../../../core/services/category.service';


@Component({
    selector: 'app-admin-category-create',
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule
    ],
    templateUrl: './admin-category-create.component.html',
    styleUrl: './admin-category-create.component.scss'
})
export class AdminCategoryCreateComponent {

    private readonly categoryService =
        inject(CategoryService);


    @Output()
    closeModal =
        new EventEmitter<void>();


    @Output()
    categoryCreated =
        new EventEmitter<Category>();


    name = '';

    slug = '';

    image = '';

    description = '';

    isActive = true;


    loading = false;

    errorMessage = '';


    // =====================================================
    // SLUG
    // =====================================================

    generateSlug(): void {

        this.slug =
            this.name
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9\s-]/g,
                    ''
                )
                .replace(
                    /\s+/g,
                    '-'
                )
                .replace(
                    /-+/g,
                    '-'
                );

    }


    // =====================================================
    // CREATE CATEGORY
    // =====================================================

    createCategory(): void {

        this.errorMessage = '';


        if (!this.name.trim()) {

            this.errorMessage =
                'Category name is required.';

            return;

        }


        if (!this.slug.trim()) {

            this.generateSlug();

        }


        if (!this.slug.trim()) {

            this.errorMessage =
                'Category slug is required.';

            return;

        }


        this.loading = true;


        const data = {

            name:
                this.name.trim(),

            slug:
                this.slug.trim(),

            image:
                this.image.trim(),

            description:
                this.description.trim(),

            isActive:
                this.isActive

        };


        this.categoryService
            .createCategory(data)
            .subscribe({

                next: (response) => {

                    this.loading = false;

                    this.categoryCreated.emit(
                        response.data
                    );

                },


                error: (error) => {

                    console.error(
                        'Create category error:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ||
                        'Failed to create category.';

                    this.loading = false;

                }

            });

    }


    // =====================================================
    // CLOSE
    // =====================================================

    cancel(): void {

        if (this.loading) {

            return;

        }

        this.closeModal.emit();

    }

}