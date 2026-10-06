import {
    Component,
    EventEmitter,
    Input,
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
    selector: 'app-admin-category-edit',
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule
    ],
    templateUrl: './admin-category-edit.component.html',
    styleUrl: './admin-category-edit.component.scss'
})
export class AdminCategoryEditComponent {

    private readonly categoryService =
        inject(CategoryService);


    // =====================================================
    // INPUT
    // =====================================================

    @Input()
    category: Category | null = null;


    // =====================================================
    // OUTPUTS
    // =====================================================

    @Output()
    closeModal =
        new EventEmitter<void>();


    @Output()
    categoryUpdated =
        new EventEmitter<Category>();


    name = '';

    slug = '';

    description = '';

    image = '';

    isActive = true;


    saving = false;

    errorMessage = '';


    // =====================================================
    // INITIALIZE FORM
    // =====================================================

    ngOnInit(): void {

        if (!this.category) {

            this.errorMessage =
                'Category not found.';

            return;

        }


        this.name =
            this.category.name;

        this.slug =
            this.category.slug;

        this.description =
            this.category.description || '';

        this.image =
            this.category.image || '';

        this.isActive =
            this.category.isActive;

    }


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
    // UPDATE CATEGORY
    // =====================================================

    updateCategory(): void {

        this.errorMessage = '';


        if (!this.category) {

            this.errorMessage =
                'Category not found.';

            return;

        }


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


        this.saving = true;


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
            .updateCategory(
                this.category._id,
                data
            )
            .subscribe({

                next: (response) => {

                    this.saving = false;

                    this.categoryUpdated.emit(
                        response.data
                    );

                },


                error: (error) => {

                    console.error(
                        'Update category error:',
                        error
                    );

                    this.errorMessage =
                        error?.error?.message ||
                        'Failed to update category.';

                    this.saving = false;

                }

            });

    }


    // =====================================================
    // CLOSE
    // =====================================================

    cancel(): void {

        if (this.saving) {

            return;

        }

        this.closeModal.emit();

    }

}