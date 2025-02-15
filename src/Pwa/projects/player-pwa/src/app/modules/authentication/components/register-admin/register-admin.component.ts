import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { AuthenticationActions } from '../../../shared/store/authentication/authentication.actions';

@Component({
  selector: 'pwa-register-admin',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './register-admin.component.html',
})
export class RegisterAdminComponent {
  private readonly store = inject(Store);

  public registerAdminForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public createAdmin(): void {
    const { email, password } = this.registerAdminForm.value;
    if (!!email && !!password) this.store.dispatch(AuthenticationActions.registerAdmin({ email, password }));
  }
}
