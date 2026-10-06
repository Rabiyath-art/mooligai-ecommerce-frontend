import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-product-card',
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

    product = input.required<Product>();

    isWishlisted = input<boolean>(false);

    addToCart = output<Product>();

    toggleWishlist = output<Product>();


    onAddToCart(): void {

        this.addToCart.emit(
            this.product()
        );

    }


    onToggleWishlist(): void {

        this.toggleWishlist.emit(
            this.product()
        );

    }

}