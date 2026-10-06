// import { Address } from './address.model';
// import { Product } from './product.model';

// export interface OrderItem {
//     product: Product;
//     name: string;
//     quantity: number;
//     price: number;
//     subtotal: number;
// }

// export interface Order {
//     _id: string;
//     user: string;
//     items: OrderItem[];
//     shippingAddress: Address;
//     subtotal: number;
//     shippingCharge: number;
//     totalAmount: number;
//     paymentStatus: | 'pending' | 'paid' | 'failed';
//     orderStatus: | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//     razorpayOrderId?: string;
//     razorpayPaymentId?: string;
//     createdAt: string;
// }

import { Address } from './address.model';
import { Product } from './product.model';

export interface OrderItem {
    _id: string;
    product: Product;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface OrderPayment {
    provider: 'razorpay';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    status:
    | 'pending'
    | 'paid'
    | 'failed'
    | 'refunded';
}

export interface Order {
    _id: string;

    user: string;

    items: OrderItem[];

    shippingAddress: Address;

    totalAmount: number;

    payment: OrderPayment;

    orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

    createdAt: string;
    updatedAt: string;
}