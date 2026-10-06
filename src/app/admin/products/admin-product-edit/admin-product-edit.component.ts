import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import {
    FormsModule
} from '@angular/forms';

import {
    AdminProductService
} from '../../../core/services/admin-product.service';

import {
    CategoryService,
    Category
} from '../../../core/services/category.service';

import {
    Product
} from '../../../core/models/product.model';


@Component({
    selector: 'app-admin-product-edit',
    imports: [CommonModule, MatIconModule, FormsModule],
    templateUrl: './admin-product-edit.component.html',
    styleUrl:        './admin-product-edit.component.scss'
})
export class AdminProductEditComponent
    implements OnInit {


    private readonly productService =
        inject(AdminProductService);


    private readonly categoryService =
        inject(CategoryService);


    @Input({
        required: true
    })
    product!: Product;


    @Output()
    close =
        new EventEmitter<void>();


    @Output()
    updated =
        new EventEmitter<Product>();


    // ========================================
    // STATE
    // ========================================

    loading = false;

    loadingCategories = false;

    errorMessage = '';

    categories: Category[] = [];


    // ========================================
    // FORM
    // ========================================

    form = {

        name: '',

        slug: '',

        description: '',

        category: '',

        price: null as number | null,

        stock: null as number | null,

        weight: '',

        ingredients: '',

        isActive: true

    };


    // ========================================
    // IMAGES
    // ========================================

    existingImages: string[] = [];

    selectedImages: File[] = [];

    imagePreviews: string[] = [];


    // ========================================
    // INIT
    // ========================================

    ngOnInit(): void {

        this.loadCategories();

        this.populateForm();

    }


    // ========================================
    // POPULATE FORM
    // ========================================

    populateForm(): void {

        if (!this.product) {
            return;
        }


        this.form.name =
            this.product.name || '';


        this.form.slug =
            this.product.slug || '';


        this.form.description =
            this.product.description || '';


        // IMPORTANT
        // category is populated object
        // in Product interface

        this.form.category =
            this.product.category?._id || '';


        this.form.price =
            this.product.price ?? null;


        this.form.stock =
            this.product.stock ?? null;


        this.form.weight =
            this.product.weight || '';


        this.form.ingredients =
            this.product.ingredients?.join(', ') || '';


        this.form.isActive =
            this.product.isActive;


        this.existingImages =
            [...(this.product.images || [])];

    }


    // ========================================
    // LOAD CATEGORIES
    // ========================================

    loadCategories(): void {

        this.loadingCategories = true;


        this.categoryService
            .getCategories()
            .subscribe({

                next: (response) => {

                    this.categories =
                        response.data || [];

                    this.loadingCategories = false;

                },

                error: (error) => {

                    console.error(
                        'Category loading error:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Failed to load categories';

                    this.loadingCategories = false;

                }

            });

    }


    // ========================================
    // SLUG
    // ========================================

    generateSlug(): void {

        if (!this.form.name.trim()) {
            return;
        }


        this.form.slug =
            this.form.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

    }


    // ========================================
    // NEW IMAGE SELECT
    // ========================================

    onImagesSelected(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;


        if (!input.files) {
            return;
        }


        const files =
            Array.from(input.files);


        const totalImages =
            this.existingImages.length +
            this.selectedImages.length +
            files.length;


        if (totalImages > 5) {

            this.errorMessage =
                'You can have a maximum of 5 images.';

            return;

        }


        for (const file of files) {

            if (
                ![
                    'image/png',
                    'image/jpeg',
                    'image/webp'
                ].includes(file.type)
            ) {

                this.errorMessage =
                    'Only PNG, JPG and WEBP images are allowed.';

                continue;

            }


            this.selectedImages.push(file);


            const reader =
                new FileReader();


            reader.onload = () => {

                this.imagePreviews.push(
                    reader.result as string
                );

            };


            reader.readAsDataURL(file);

        }


        this.errorMessage = '';

        input.value = '';

    }


    // ========================================
    // REMOVE EXISTING IMAGE
    // ========================================

    removeExistingImage(
        index: number
    ): void {

        this.existingImages.splice(
            index,
            1
        );

    }


    // ========================================
    // REMOVE NEW IMAGE
    // ========================================

    removeNewImage(
        index: number
    ): void {

        this.selectedImages.splice(
            index,
            1
        );

        this.imagePreviews.splice(
            index,
            1
        );

    }


    // ========================================
    // VALIDATE
    // ========================================

    isFormValid(): boolean {

        return !!(

            this.form.name.trim() &&

            this.form.slug.trim() &&

            this.form.description.trim() &&

            this.form.category &&

            this.form.price !== null &&

            this.form.stock !== null

        );

    }


    // ========================================
    // UPDATE
    // ========================================

    submit(): void {

        if (
            this.loading ||
            !this.product
        ) {

            return;

        }


        this.errorMessage = '';


        this.generateSlug();


        if (!this.isFormValid()) {

            this.errorMessage =
                'Please fill all required fields.';

            return;

        }


        if (this.form.price! < 0) {

            this.errorMessage =
                'Price cannot be negative.';

            return;

        }


        if (this.form.stock! < 0) {

            this.errorMessage =
                'Stock cannot be negative.';

            return;

        }


        const formData =
            new FormData();


        formData.append(
            'name',
            this.form.name.trim()
        );


        formData.append(
            'slug',
            this.form.slug.trim()
        );


        formData.append(
            'description',
            this.form.description.trim()
        );


        formData.append(
            'category',
            this.form.category
        );


        formData.append(
            'price',
            String(this.form.price)
        );


        formData.append(
            'stock',
            String(this.form.stock)
        );


        formData.append(
            'weight',
            this.form.weight.trim()
        );


        formData.append(
            'isActive',
            String(this.form.isActive)
        );


        const ingredients =
            this.form.ingredients
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);


        formData.append(
            'ingredients',
            JSON.stringify(ingredients)
        );


        // ========================================
        // IMPORTANT
        // Send existing image URLs
        // ========================================

        formData.append(
            'existingImages',
            JSON.stringify(
                this.existingImages
            )
        );


        // ========================================
        // NEW IMAGES
        // ========================================

        this.selectedImages.forEach(
            file => {

                formData.append(
                    'images',
                    file
                );

            }
        );


        this.loading = true;


        this.productService
            .updateProduct(
                this.product._id,
                formData
            )
            .subscribe({

                next: (response) => {

                    this.loading = false;


                    if (response.data) {

                        this.updated.emit(
                            response.data
                        );

                    }

                },

                error: (error) => {

                    console.error(
                        'Update product error:',
                        error
                    );


                    this.loading = false;


                    this.errorMessage =
                        error.error?.message ||
                        'Failed to update product';

                }

            });

    }


    // ========================================
    // CLOSE
    // ========================================

    closeModal(): void {

        if (this.loading) {
            return;
        }

        this.close.emit();

    }

}