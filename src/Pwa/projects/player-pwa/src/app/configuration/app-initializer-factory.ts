import type { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { catchError, concatMap, map, of } from 'rxjs';
import { DATABASE_NAME } from '../modules/shared/constants/database-name';
import { PersistenceService } from '../modules/shared/services/persistence/persistence.service';
import { HYDRATE_STORE } from '../modules/shared/store/meta-management/store-meta-management.actions';

export function initializeAppFactory(persistenceService: PersistenceService, store: Store): () => Observable<void> {
  return () =>
    persistenceService.openDatabase(DATABASE_NAME).pipe(
      concatMap(() => {
        return of(persistenceService.askPermissionForPersistence());
      }),
      concatMap(() => {
        return persistenceService.getState().pipe(
          map((state) => {
            store.dispatch(HYDRATE_STORE({ state }));
          }),
        );
      }),
      catchError(() => {
        console.error('Could not open connection to indexedDB, no persistence of data possible !');
        return of();
      }),
    );
}
