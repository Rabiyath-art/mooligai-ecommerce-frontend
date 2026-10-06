import {
  Component,
  EventEmitter,
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
  selector: 'app-admin-product-create',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './admin-product-create.component.html',
  styleUrl: './admin-product-create.component.scss'
})
export class AdminProductCreateComponent implements OnInit {

  private readonly productService = inject(AdminProductService);
  private readonly categoryService = inject(CategoryService);
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Product>();

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

  product = {

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

  selectedImages: File[] = [];

  imagePreviews: string[] = [];


  // ========================================
  // INIT
  // ========================================

  ngOnInit(): void {

    this.loadCategories();

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

    if (!this.product.name.trim()) {

      this.product.slug = '';

      return;

    }


    this.product.slug =
      this.product.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

  }


  // ========================================
  // IMAGE SELECT
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


    if (
      this.selectedImages.length +
      files.length > 5
    ) {

      this.errorMessage =
        'You can upload a maximum of 5 images.';

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
  // REMOVE IMAGE
  // ========================================

  removeImage(index: number): void {

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

      this.product.name.trim() &&

      this.product.slug.trim() &&

      this.product.description.trim() &&

      this.product.category &&

      this.product.price !== null &&

      this.product.stock !== null

    );

  }


  // ========================================
  // CREATE
  // ========================================

  submit(): void {

    if (this.loading) {
      return;
    }


    this.errorMessage = '';


    // Generate slug automatically
    this.generateSlug();


    if (!this.isFormValid()) {

      this.errorMessage =
        'Please fill all required fields.';

      return;

    }


    if (
      this.product.price! < 0
    ) {

      this.errorMessage =
        'Price cannot be negative.';

      return;

    }


    if (
      this.product.stock! < 0
    ) {

      this.errorMessage =
        'Stock cannot be negative.';

      return;

    }


    const formData =
      new FormData();


    formData.append(
      'name',
      this.product.name.trim()
    );


    formData.append(
      'slug',
      this.product.slug.trim()
    );


    formData.append(
      'description',
      this.product.description.trim()
    );


    formData.append(
      'category',
      this.product.category
    );


    formData.append(
      'price',
      String(this.product.price)
    );


    formData.append(
      'stock',
      String(this.product.stock)
    );


    formData.append(
      'weight',
      this.product.weight.trim()
    );


    formData.append(
      'isActive',
      String(this.product.isActive)
    );


    const ingredients =
      this.product.ingredients
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);


    formData.append(
      'ingredients',
      JSON.stringify(ingredients)
    );


    // Images

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
      .createProduct(formData)
      .subscribe({

        next: (response) => {

          this.loading = false;


          if (response.data) {

            this.created.emit(
              response.data
            );

          }

        },

        error: (error) => {

          console.error(
            'Create product error:',
            error
          );


          this.loading = false;


          this.errorMessage =
            error.error?.message ||
            'Failed to create product';

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