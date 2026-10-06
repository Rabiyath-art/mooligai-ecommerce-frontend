export interface Customer {

    _id: string;

    name: string;

    email: string;

    avatar?: string;

    provider?: string;

    role?: 'customer' | 'admin';

    isActive: boolean;

    createdAt: string;

    updatedAt?: string;

    orderCount: number;

    totalSpent: number;

}


export interface CustomerPagination {

    total: number;

    page: number;

    limit: number;

    totalPages: number;

}


export interface CustomerListResponse {

    success: boolean;

    data: Customer[];

    pagination: CustomerPagination;

}

export interface CustomerOrderItem {

    _id: string;

    name?: string;

    price: number;

    quantity: number;

    subtotal?: number;

    product?: {

        _id: string;

        name: string;

        images: string[];

        weight?: string;

    };

}


export interface CustomerOrder {

    _id: string;

    items: CustomerOrderItem[];

    totalAmount: number;

    status?: string;

    orderStatus?: string;

    payment?: {

        status: string;

        razorpayPaymentId?: string;

    };

    shippingAddress?: {

        name: string;

        addressLine1: string;

        addressLine2?: string;

        city: string;

        state: string;

        pincode: string;

        phone: string;

    };

    createdAt: string;

}


export interface CustomerDetailResponse {

    success: boolean;

    data: {

        customer: Customer;

        statistics: {

            totalOrders: number;

            paidOrders: number;

            totalSpent: number;

        };

        orders: CustomerOrder[];

    };

}