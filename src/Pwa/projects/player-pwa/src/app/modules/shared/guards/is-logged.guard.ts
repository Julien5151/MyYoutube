import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE } from '../../../app.routes';
import { selectIsLoggedIn } from '../store/authentication/authentication.selectors';

export const isLoggedGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectIsLoggedIn).pipe(
    tap((isLogged) => {
      if (!isLogged) router.navigate([AUTHENTICATION_ROUTE, LOGIN_ROUTE]);
    }),
  );
};
