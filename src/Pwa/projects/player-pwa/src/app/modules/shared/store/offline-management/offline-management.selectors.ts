import { createFeatureSelector, createSelector } from '@ngrx/store';

import type { OfflineManagementState } from './offline-management.feature';
import { offlineManagementFeature, offlineManagementFeatureStateKey } from './offline-management.feature';

export const { selectIsPersistencePending, selectIsOfflineForced, selectIsOnline } = offlineManagementFeature;

export const selectFeature = createFeatureSelector<OfflineManagementState>(offlineManagementFeatureStateKey);

export const selectIsOfflineOrOfflineForced = createSelector(
  selectFeature,
  (state: OfflineManagementState) => state.isOfflineForced || !state.isOnline,
);
