import { createFeature, createReducer, on } from '@ngrx/store';
import { Role } from '../../enums/role.enum';
import { uuid } from '../../types/uuid.type';
import { AuthenticationActions } from './authentication.actions';

export interface AuthenticationState {
  isLoggedIn: boolean;
  userId: uuid | null;
  email: string | null;
  role: Role | null;
}

export const initialState: AuthenticationState = {
  isLoggedIn: false,
  userId: null,
  email: null,
  role: null,
};

export const authenticationFeature = createFeature({
  name: 'authentication',
  reducer: createReducer(
    initialState,
    on(
      AuthenticationActions.login,
      AuthenticationActions.loginFailed,
      AuthenticationActions.logout,
      (state): AuthenticationState => ({
        ...state,
        userId: null,
        email: null,
        isLoggedIn: false,
        role: null,
      }),
    ),
    on(
      AuthenticationActions.loginSuccess,
      (state, { email, userId, role }): AuthenticationState => ({
        ...state,
        isLoggedIn: true,
        userId,
        email,
        role,
      }),
    ),
  ),
});
