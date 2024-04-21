import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE, USER_MANAGEMENT_ROUTE } from '../../app.routes';
import { AuthenticationActions } from '../shared/store/authentication/authentication.actions';

@Component({
  selector: 'pwa-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly actions$ = inject(Actions);

  public navItems = [{ icon: 'group_add', routerLink: `./${USER_MANAGEMENT_ROUTE}` }];

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
    this.actions$.pipe(ofType(AuthenticationActions.logoutSuccess), take(1)).subscribe(() => {
      this.router.navigate([AUTHENTICATION_ROUTE, LOGIN_ROUTE]);
    });
  }
}
