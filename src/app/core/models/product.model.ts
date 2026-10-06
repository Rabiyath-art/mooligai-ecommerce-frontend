export interface ProductCategory {
    _id: string;
    name: string;
    slug: string;
}

export interface Product {
    _id: string;

    name: string;

    slug: string;

    description: string;

    shortDescription?: string;

    price: number;

    comparePrice?: number;

    images: string[];

    category: ProductCategory;

    ingredients?: string[];

    weight?: string;

    stock: number;

    isActive: boolean;

    createdAt: string;

    updatedAt: string;
}