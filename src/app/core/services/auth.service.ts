import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    BehaviorSubject,
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';

import {
    User
} from '../models/user.model';

import {
    AuthResponse
} from '../models/auth.model';

import {
    Router
} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly http =
        inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/auth`;


    private readonly userSubject =
        new BehaviorSubject<User | null>(null);

    readonly user$ =
        this.userSubject.asObservable();


    private readonly loggedInSubject =
        new BehaviorSubject<boolean>(false);

    readonly isLoggedIn$ =
        this.loggedInSubject.asObservable();

    private readonly authInitializedSubject =
        new BehaviorSubject<boolean>(false);

    readonly authInitialized$ =
        this.authInitializedSubject.asObservable();

    private readonly router =
        inject(Router);

    getCurrentUser(): Observable<AuthResponse> {

        return this.http.get<AuthResponse>(
            `${this.apiUrl}/me`,
            {
                withCredentials: true
            }
        );

    }


    loadCurrentUser(): void {
        this.getCurrentUser().subscribe({
            next: (response) => {
                const user = response.data;
                this.userSubject.next(user);
                this.loggedInSubject.next(true);
                this.authInitializedSubject.next(true);

                // ROLE BASED REDIRECT
                if (user.role === 'admin') {
                    this.router.navigate(['/admin/dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            },

            error: (error) => {
                this.userSubject.next(null);
                this.loggedInSubject.next(false);
                this.authInitializedSubject.next(true);
            }
        });
    }

    // Then guards should handle admin navigation, not AuthService.loadCurrentUser().

    // loadCurrentUser(): void {
    //     this.getCurrentUser().subscribe({
    //         next: (response) => {
    //             this.userSubject.next(response.data);
    //             this.loggedInSubject.next(true);
    //             this.authInitializedSubject.next(true);
    //         },

    //         error: (error) => {
    //             this.userSubject.next(null);
    //             this.loggedInSubject.next(false);
    //             this.authInitializedSubject.next(true);
    //         }
    //     });

    // }

    loginWithGoogle(): void {
        window.location.href = `${this.apiUrl}/google`;
    }


    logout(): Observable<{ success: boolean; message: string; }> {
        return this.http.post<{ success: boolean; message: string; }>(`${this.apiUrl}/logout`,
            {},
            {
                withCredentials: true
            }
        );

    }


    handleLogout(): void {

        this.logout()
            .subscribe({

                next: () => {

                    this.userSubject.next(null);

                    this.loggedInSubject.next(
                        false
                    );

                },

                error: (error) => {

                    console.error(
                        'Logout failed',
                        error
                    );

                }

            });
    }


    get user(): User | null {
        return this.userSubject.value;
    }


    get isLoggedIn(): boolean {
        return this.loggedInSubject.value;
    }

}