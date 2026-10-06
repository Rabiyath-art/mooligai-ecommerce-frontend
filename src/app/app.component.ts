import { Component, inject, OnInit } from '@angular/core';
import {
    Router,
    RouterOutlet,
    NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'frontend';

    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    isAdminRoute = false;

    ngOnInit(): void {
        this.authService.loadCurrentUser();

        this.router.events
            .pipe(
                filter(
                    event =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe(
                (event: NavigationEnd) => {

                    this.isAdminRoute =
                        event.urlAfterRedirects
                            .startsWith('/admin');

                }
            );
    }
}
