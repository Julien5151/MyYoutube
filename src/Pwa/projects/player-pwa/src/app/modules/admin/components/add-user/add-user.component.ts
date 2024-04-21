import { Component, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UsersActions } from '../../core/store/users/users.actions';

@Component({
  selector: 'pwa-add-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  @ViewChild(FormGroupDirective) private addUserformGroupDirective!: FormGroupDirective;

  public addUserForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.actions$.pipe(ofType(UsersActions.signUpUserSuccess), takeUntilDestroyed()).subscribe(() => {
      this.addUserformGroupDirective.resetForm();
    });
  }

  public createUser(): void {
    const { email, password } = this.addUserForm.value;
    if (!!email && !!password) this.store.dispatch(UsersActions.signUpUser({ email, password }));
  }
}
