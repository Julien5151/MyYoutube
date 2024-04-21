import { createFeature, createReducer, on } from '@ngrx/store';

import { OfflineManagementActions } from './offline-management.actions';

export const offlineManagementFeatureStateKey: string = 'offline-management';

export interface OfflineManagementState {
  isPersistencePending: boolean;
  isOfflineForced: boolean;
  isOnline: boolean;
}

export const initialState: OfflineManagementState = {
  isPersistencePending: false,
  isOfflineForced: false,
  isOnline: true,
};

export const offlineManagementFeature = createFeature({
  name: offlineManagementFeatureStateKey,
  reducer: createReducer(
    initialState,
    on(
      OfflineManagementActions.disconnected,
      (state): OfflineManagementState => ({
        ...state,
        isOnline: false,
      }),
    ),
    on(
      OfflineManagementActions.connected,
      (state): OfflineManagementState => ({
        ...state,
        isOnline: true,
      }),
    ),
    on(
      OfflineManagementActions.persistencePending,
      (state): OfflineManagementState => ({
        ...state,
        isPersistencePending: true,
      }),
    ),
    on(
      OfflineManagementActions.persistenceCompleted,
      (state): OfflineManagementState => ({
        ...state,
        isPersistencePending: false,
      }),
    ),
    on(
      OfflineManagementActions.persistenceFailed,
      (state): OfflineManagementState => ({
        ...state,
        isPersistencePending: true,
      }),
    ),
    on(OfflineManagementActions.toggleOnOfflineMode, (state): OfflineManagementState => {
      return {
        ...state,
        isOfflineForced: true,
      };
    }),
    on(OfflineManagementActions.toggleOffOfflineMode, (state): OfflineManagementState => {
      return {
        ...state,
        isOfflineForced: false,
      };
    }),
  ),
});
