import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { UserService } from '../../core/services/user/user.service';
import { UsersActions } from '../../core/store/users/users.actions';

export const signupUserEffect = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) => {
    return actions$.pipe(
      ofType(UsersActions.signUpUser),
      exhaustMap(({ email, password }) =>
        userService.signup(email, password).pipe(
          map(() => UsersActions.signUpUserSuccess()),
          catchError(() => of(UsersActions.signUpUserFailed())),
        ),
      ),
    );
  },
  { functional: true },
);
