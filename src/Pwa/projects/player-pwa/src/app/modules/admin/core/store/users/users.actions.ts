import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    SignUpUser: props<{ email: string; password: string }>(),
    SignUpUserSuccess: emptyProps(),
    SignUpUserFailed: emptyProps(),
  },
});
