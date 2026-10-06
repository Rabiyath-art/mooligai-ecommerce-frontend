import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/cart`;
    private readonly cartCountSubject = new BehaviorSubject<number>(0);
    readonly cartCount$ = this.cartCountSubject.asObservable();

    getCart(): Observable<{ success: boolean; data: Cart; }> {
        return this.http.get<{ success: boolean; data: Cart; }>(
            this.apiUrl, { withCredentials: true }
        );
    }


    addToCart(productId: string, quantity = 1): Observable<{ success: boolean; data: Cart; }> {
        return this.http.post<{ success: boolean; data: Cart; }>(`${this.apiUrl}/add`, {
            productId,
            quantity
        },
            {
                withCredentials: true
            }
        );
    }

    updateQuantity(productId: string, quantity: number): Observable<{ success: boolean; data: Cart; }> {

        return this.http.put<{
            success: boolean;
            data: Cart;
        }>(
            `${this.apiUrl}/update`,
            {
                productId,
                quantity
            },
            {
                withCredentials: true
            }
        );

    }


    removeFromCart(productId: string): Observable<{ success: boolean; data: Cart; }> {
        return this.http.delete<{
            success: boolean;
            data: Cart;
        }>(
            `${this.apiUrl}/remove/${productId}`,
            {
                withCredentials: true
            }
        );
    }

    clearCart(): Observable<{ success: boolean; data: Cart; }> {
        return this.http.delete<{ success: boolean; data: Cart; }>(
            `${this.apiUrl}/clear`,
            {
                withCredentials: true
            }
        );

    }

    updateCartCount(cart: Cart): void {
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        this.cartCountSubject.next(count);
    }
}