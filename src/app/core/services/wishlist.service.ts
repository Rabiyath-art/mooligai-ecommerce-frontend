import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wishlist } from '../models/wishlist.model';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {

    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/wishlist`;

    private readonly wishlistCountSubject =
        new BehaviorSubject<number>(0);

    readonly wishlistCount$ =
        this.wishlistCountSubject.asObservable();


    // ==========================================
    // GET WISHLIST
    // ==========================================

    getWishlist(): Observable<{
        success: boolean;
        data: Wishlist;
    }> {

        return this.http.get<{
            success: boolean;
            data: Wishlist;
        }>(
            this.apiUrl,
            {
                withCredentials: true
            }
        );

    }


    // ==========================================
    // ADD TO WISHLIST
    // ==========================================

    addToWishlist(productId: string): Observable<{
        success: boolean;
        data: Wishlist;
    }> {

        return this.http.post<{
            success: boolean;
            data: Wishlist;
        }>(
            `${this.apiUrl}/add`,
            {
                productId
            },
            {
                withCredentials: true
            }
        );

    }


    // ==========================================
    // REMOVE FROM WISHLIST
    // ==========================================

    removeFromWishlist(productId: string): Observable<{
        success: boolean;
        data: Wishlist;
    }> {

        return this.http.delete<{
            success: boolean;
            data: Wishlist;
        }>(
            `${this.apiUrl}/remove/${productId}`,
            {
                withCredentials: true
            }
        );

    }


    // ==========================================
    // TOGGLE WISHLIST
    // ==========================================

    toggleWishlist(productId: string): Observable<{
        success: boolean;
        data: Wishlist;
    }> {

        return this.http.post<{
            success: boolean;
            data: Wishlist;
        }>(
            `${this.apiUrl}/toggle`,
            {
                productId
            },
            {
                withCredentials: true
            }
        );

    }


    // ==========================================
    // UPDATE NAVBAR COUNT
    // ==========================================

    updateWishlistCount(wishlist: Wishlist): void {

        const count = wishlist.products.length;
        this.wishlistCountSubject.next(count);

    }

}