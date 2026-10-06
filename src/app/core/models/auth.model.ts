import { User } from './user.model';

export interface AuthResponse {
    success: boolean;
    data: User;
}