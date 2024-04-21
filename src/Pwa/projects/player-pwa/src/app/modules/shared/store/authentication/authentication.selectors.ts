import { authenticationFeature } from './authentication.feature';

export const {
  name, // feature name
  reducer, // feature reducer
  selectAuthenticationState, // feature selector
  selectIsLoggedIn, // selector for `isLoggedIn` property
  selectUserId, // selector for `userId` property
  selectEmail,
  selectRole,
} = authenticationFeature;
