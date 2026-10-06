export interface Address {
    _id: string;

    name: string;

    phone: string;

    addressLine1: string;

    addressLine2?: string;

    city: string;

    state: string;

    pincode: string;

    landmark?: string;

    isDefault: boolean;

    createdAt?: string;

    updatedAt?: string;
}