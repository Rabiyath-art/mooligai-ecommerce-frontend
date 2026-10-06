import { Product } from './product.model';

export interface CartItem {
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}