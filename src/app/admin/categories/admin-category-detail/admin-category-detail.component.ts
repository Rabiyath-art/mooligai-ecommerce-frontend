import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
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

@Component({
  selector: 'app-admin-category-detail',
  imports: [
    CommonModule,
    MatIconModule],
  templateUrl: './admin-category-detail.component.html',
  styleUrl: './admin-category-detail.component.scss'
})
export class AdminCategoryDetailComponent implements OnInit {

  private readonly route =
    inject(ActivatedRoute);


  private readonly router =
    inject(Router);


  private readonly categoryService =
    inject(CategoryService);


  category: Category | null = null;

  loading = true;

  errorMessage = '';


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.errorMessage =
        'Category ID not found.';

      this.loading = false;

      return;

    }


    this.loadCategory(id);

  }


  loadCategory(
    id: string
  ): void {

    this.categoryService
      .getCategoryById(id)
      .subscribe({

        next: (response) => {

          this.category =
            response.data;

          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Category detail error:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load category.';

          this.loading = false;

        }

      });

  }


  editCategory(): void {

    if (!this.category) {

      return;

    }


    this.router.navigate([
      '/admin/categories',
      this.category._id,
      'edit'
    ]);

  }


  goBack(): void {

    this.router.navigate([
      '/admin/categories'
    ]);

  }
}
