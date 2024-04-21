import { Injectable, inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { concatMap, debounceTime, filter, map, take } from 'rxjs/operators';
import { PersistenceOperationResult } from '../../enums/persistence-operation-result.enum';
import { PersistenceService } from '../../services/persistence/persistence.service';
import { OfflineManagementActions } from './offline-management.actions';
import { selectIsPersistencePending } from './offline-management.selectors';

@Injectable()
export class OfflineManagementEffects {
  private readonly online$ = new Subject<boolean>();
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly persistenceService = inject(PersistenceService);

  private readonly persistenceDebounceDelay = 200;

  constructor() {
    globalThis.addEventListener('offline', () => {
      this.online$.next(false);
    });
    globalThis.addEventListener('online', () => {
      this.online$.next(true);
    });
  }

  persistencePending$ = createEffect(() => {
    return this.actions$.pipe(
      concatLatestFrom(() => this.store.select(selectIsPersistencePending)),
      filter(
        ([action, isPersistencePending]) =>
          !isPersistencePending &&
          action.type !== OfflineManagementActions.persistencePending.type &&
          action.type !== OfflineManagementActions.persistenceFailed.type &&
          action.type !== OfflineManagementActions.persistenceCompleted.type,
      ),
      map(() => {
        return OfflineManagementActions.persistencePending();
      }),
    );
  });

  persistStoreToIndexedDb$ = createEffect(() => {
    return this.actions$.pipe(
      filter(
        (action) =>
          action.type !== OfflineManagementActions.persistenceFailed.type && action.type !== OfflineManagementActions.persistenceCompleted.type,
      ),
      debounceTime(this.persistenceDebounceDelay),
      // eslint-disable-next-line @ngrx/prefer-selector-in-select
      concatLatestFrom(() => this.store.select((state) => state)),
      concatMap(([, state]) => {
        return this.persistenceService.saveState(state).pipe(
          take(1),
          map((operation) => {
            return operation === PersistenceOperationResult.Success
              ? OfflineManagementActions.persistenceCompleted()
              : OfflineManagementActions.persistenceFailed();
          }),
        );
      }),
    );
  });

  network$ = createEffect(() => {
    return this.online$.pipe(map((isOnline) => (isOnline ? OfflineManagementActions.connected() : OfflineManagementActions.disconnected())));
  });
}
