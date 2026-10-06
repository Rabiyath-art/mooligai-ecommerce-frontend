import { inject } from '@angular/core';

import {
  Router,
  CanActivateFn
} from '@angular/router';

import {
  map,
  filter,
  take
} from 'rxjs';

import {
  AuthService
} from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('ADMIN GUARD STARTED');

  return authService.authInitialized$
    .pipe(

      filter(
        initialized => initialized
      ),

      take(1),

      map(() => {

        const user = authService.user;

        console.log(
          'ADMIN GUARD USER:',
          user
        );

        console.log(
          'ADMIN GUARD ROLE:',
          user?.role
        );

        if (
          user &&
          user.role === 'admin'
        ) {

          console.log(
            'ADMIN ACCESS GRANTED'
          );

          return true;
        }

        console.log(
          'ADMIN ACCESS DENIED'
        );

        return router.createUrlTree(['/']);

      })

    );
}; 