import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE } from '../../../app.routes';
import { Role } from '../enums/role.enum';
import { selectRole } from '../store/authentication/authentication.selectors';

export const isAdminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectRole).pipe(
    tap((role) => {
      if (role !== Role.Admin) router.navigate([AUTHENTICATION_ROUTE, LOGIN_ROUTE]);
    }),
    map((role) => role === Role.Admin),
  );
};
