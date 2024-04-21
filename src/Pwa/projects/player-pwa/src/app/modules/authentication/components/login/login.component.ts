import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ADMIN_ROUTE, PLAYER_ROUTE, USER_MANAGEMENT_ROUTE } from '../../../../app.routes';
import { Role } from '../../../shared/enums/role.enum';
import { AuthenticationActions } from '../../../shared/store/authentication/authentication.actions';

@Component({
  selector: 'pwa-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    this.actions$.pipe(ofType(AuthenticationActions.loginSuccess), take(1)).subscribe((action) => {
      const isAdmin = action.role == Role.Admin;
      this.router.navigate(isAdmin ? [ADMIN_ROUTE, USER_MANAGEMENT_ROUTE] : [PLAYER_ROUTE]);
    });
  }

  public login(): void {
    const { email, password } = this.loginForm.value;
    if (!!email && !!password) this.store.dispatch(AuthenticationActions.login({ email, password }));
  }
}
