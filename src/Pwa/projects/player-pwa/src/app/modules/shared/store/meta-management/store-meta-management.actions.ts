import { createAction, emptyProps, props } from '@ngrx/store';

export const HYDRATE_STORE = createAction('[META-ACTION] Hydrate store', props<{ state: unknown }>());
export const RESET_STORE = createAction('[META-ACTION] Reset store', emptyProps);
