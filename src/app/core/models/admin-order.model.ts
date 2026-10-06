import { Address } from './address.model';
import { Product } from './product.model';

export interface AdminOrderUser {

    _id: string;

    name: string;

    email: string;

    avatar?: string;

    provider?: string;

}


export interface AdminOrderItem {

    _id: string;

    product: Product;

    name: string;

    quantity: number;

    price: number;

    subtotal: number;

}


export interface AdminOrderPayment {

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


export interface AdminOrder {

    _id: string;

    user: AdminOrderUser;

    items: AdminOrderItem[];

    shippingAddress: Address;

    totalAmount: number;

    payment: AdminOrderPayment;

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

export interface AdminOrderPagination {

    total: number;

    page: number;

    limit: number;

    totalPages: number;

}


export interface AdminOrdersResponse {

    success: boolean;

    data: AdminOrder[];

    pagination: AdminOrderPagination;

}

export interface AdminOrderDetailResponse {

    success: boolean;

    data: AdminOrder;

}

export interface UpdateOrderStatusResponse {

    success: boolean;

    message: string;

    data: AdminOrder;

}