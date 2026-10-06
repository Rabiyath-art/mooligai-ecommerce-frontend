import { Product } from './product.model';

export interface Wishlist {
    _id: string;
    user: string;
    products: Product[];
    createdAt?: string;
    updatedAt?: string;
}