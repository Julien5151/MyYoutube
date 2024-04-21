import type { Action, ActionReducer } from '@ngrx/store';
import { HYDRATE_STORE, RESET_STORE } from './store-meta-management.actions';

export function hydrateState<State>(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action: Action & { state?: State }) => {
    const stateFromIndexedDb = action.state;
    if (action.type === HYDRATE_STORE.type && stateFromIndexedDb) return reducer(stateFromIndexedDb, action);
    if (action.type === RESET_STORE.type) return reducer({} as State, action);
    return reducer(state, action);
  };
}
