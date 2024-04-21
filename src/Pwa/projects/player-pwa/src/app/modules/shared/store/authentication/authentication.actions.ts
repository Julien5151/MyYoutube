import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Role } from '../../enums/role.enum';
import { uuid } from '../../types/uuid.type';

export const AuthenticationActions = createActionGroup({
  source: 'Authentication',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ email: string; userId: uuid; role: Role }>(),
    'Login Failed': emptyProps(),
    'Register Admin': props<{ email: string; password: string }>(),
    'Register Admin Success': emptyProps(),
    'Register Admin Failed': emptyProps(),
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failed': emptyProps(),
  },
});
