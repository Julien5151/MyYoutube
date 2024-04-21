import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { Subject, take } from 'rxjs';

import { ObjectStoreName } from '../../enums/object-store-name.enum';
import { PersistenceOperationResult } from '../../enums/persistence-operation-result.enum';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private database?: IDBDatabase;
  private readonly storeKey = 'STORE_KEY';

  public askPermissionForPersistence(): Promise<boolean> | void {
    if (!navigator?.storage.persist) throw new Error('Storage Manager persistence not supported by this browser');
    return navigator.storage.persist();
  }

  public openDatabase(dbName: string): Observable<void> {
    const dbReady$ = new Subject<void>();
    try {
      const request = globalThis.indexedDB.open(dbName);
      request.onerror = (): void => {
        dbReady$.error('IndexedDB usage not allowed by user. No persistence (hence offline mode) possible');
      };
      // On upgrade needed triggered at database creation or if an updated version is requested when opening
      request.onupgradeneeded = (event: Event): void => {
        // Create object stores
        const database = (event.target as { result?: IDBDatabase } | null)?.result;
        database?.createObjectStore(ObjectStoreName.Store);
        database?.createObjectStore(ObjectStoreName.Files);
      };
      // On success only triggered if "onupgradeneeded" completed without error
      request.onsuccess = (event: Event): void => {
        // Store database for future usage
        this.database = (event.target as unknown as (Event & { result?: IDBDatabase }) | null)?.result;
        // Add request error handler
        this.addGlobalRequestsErrorHandler();
        dbReady$.next();
      };
    } catch (error) {
      dbReady$.error(`Could not open database with name ${dbName} because of error : ${String(error)}`);
    }
    return dbReady$.pipe(take(1));
  }

  public saveState(state: unknown | null): Observable<PersistenceOperationResult> {
    return this.saveItem<unknown | null>(state, this.storeKey, ObjectStoreName.Store);
  }

  public getState(): Observable<unknown | null> {
    return this.getItem<unknown | null>(this.storeKey, ObjectStoreName.Store);
  }

  public saveItem<T>(item: T, key: IDBValidKey, objectStoreName: ObjectStoreName): Observable<PersistenceOperationResult> {
    const request = this.database?.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName).put(item, key);
    const notifier$ = new Subject<PersistenceOperationResult>();
    request?.addEventListener(PersistenceOperationResult.Success, () => {
      notifier$.next(PersistenceOperationResult.Success);
    });
    request?.addEventListener(PersistenceOperationResult.Error, () => {
      notifier$.next(PersistenceOperationResult.Error);
    });
    return notifier$.pipe(take(1));
  }

  public getItem<T>(key: IDBValidKey, objectStoreName: ObjectStoreName): Observable<T | null> {
    const request = this.database?.transaction([objectStoreName], 'readonly').objectStore(objectStoreName).get(key);
    const notifier$ = new Subject<T | null>();
    request?.addEventListener(PersistenceOperationResult.Success, () => {
      const item: T = request?.result;
      notifier$.next(item ?? null);
    });
    request?.addEventListener(PersistenceOperationResult.Error, () => {
      notifier$.next(null);
    });
    return notifier$.pipe(take(1));
  }

  public getAllItems<T>(objectStoreName: ObjectStoreName): Observable<Record<string, T> | null> {
    const notifier$ = new Subject<Record<string, T> | null>();
    const cursorObj = this.database?.transaction([objectStoreName], 'readonly').objectStore(objectStoreName).openCursor();
    const items: Record<string, T> = {};
    cursorObj?.addEventListener(PersistenceOperationResult.Success, (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cursor = (event?.target as any)?.result as IDBCursorWithValue;
      if (cursor) {
        items[cursor.primaryKey as string] = cursor.value;
        cursor.continue();
      } else {
        notifier$.next(items);
      }
    });
    cursorObj?.addEventListener(PersistenceOperationResult.Error, () => {
      notifier$.next(null);
    });
    return notifier$.pipe(take(1));
  }

  public removeItem(key: IDBValidKey, objectStoreName: ObjectStoreName): Observable<PersistenceOperationResult> {
    const request = this.database?.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName).delete(key);
    const notifier$ = new Subject<PersistenceOperationResult>();
    request?.addEventListener(PersistenceOperationResult.Success, () => {
      notifier$.next(PersistenceOperationResult.Success);
    });
    request?.addEventListener(PersistenceOperationResult.Error, () => {
      notifier$.next(PersistenceOperationResult.Error);
    });
    return notifier$.pipe(take(1));
  }

  public deleteDbAndReload(dbName: string): void {
    this.database?.close();
    const deleteDbRequest = globalThis.indexedDB.deleteDatabase(dbName);
    deleteDbRequest.onerror = (): void => {
      console.error('IndexedDB could not be deleted');
    };
    deleteDbRequest.onsuccess = (): void => {
      this.reloadPage();
    };
  }

  private addGlobalRequestsErrorHandler(): void {
    this.database?.addEventListener(PersistenceOperationResult.Error, (event: Event) => {
      console.error(`Database error: ${String(event)}`);
    });
  }

  private reloadPage(): void {
    globalThis.location.reload();
  }
}
