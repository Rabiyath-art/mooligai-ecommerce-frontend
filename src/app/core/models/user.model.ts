export interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'customer' | 'admin';
    provider: 'google';
    createdAt: string;
    updatedAt: string;
}