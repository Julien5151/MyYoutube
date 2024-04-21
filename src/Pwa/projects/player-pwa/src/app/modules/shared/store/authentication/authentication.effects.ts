import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AuthenticationActions } from './authentication.actions';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authenticationService = inject(AuthenticationService)) => {
    return actions$.pipe(
      ofType(AuthenticationActions.login),
      exhaustMap(({ email, password }) =>
        authenticationService.login(email, password).pipe(
          map(({ userId, email, role }) => AuthenticationActions.loginSuccess({ email, userId, role })),
          catchError(() => of(AuthenticationActions.loginFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), authenticationService = inject(AuthenticationService)) => {
    return actions$.pipe(
      ofType(AuthenticationActions.logout),
      exhaustMap(() =>
        authenticationService.logout().pipe(
          map(() => AuthenticationActions.logoutSuccess()),
          catchError(() => of(AuthenticationActions.logoutFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const registerAdminEffect = createEffect(
  (actions$ = inject(Actions), authenticationService = inject(AuthenticationService)) => {
    return actions$.pipe(
      ofType(AuthenticationActions.registerAdmin),
      exhaustMap(({ email, password }) =>
        authenticationService.registerAdmin(email, password).pipe(
          map(() => AuthenticationActions.registerAdminSuccess()),
          catchError(() => of(AuthenticationActions.registerAdminFailed())),
        ),
      ),
    );
  },
  { functional: true },
);
