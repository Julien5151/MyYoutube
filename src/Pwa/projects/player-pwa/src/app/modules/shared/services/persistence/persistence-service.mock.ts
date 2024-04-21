import { Injectable, inject } from '@angular/core';
import { MockStore } from '@ngrx/store/testing';
import type { Observable } from 'rxjs';
import { Subject, of, take } from 'rxjs';

import type { PersistenceOperationResult } from '../../enums/persistence-operation-result.enum';

@Injectable({ providedIn: 'root' })
export class PersistenceServiceMock {
  private readonly mockStore = inject(MockStore);
  private mockSaveStateOperationResult$ = new Subject<PersistenceOperationResult>();

  public askPermissionForPersistence(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public openDatabase(): Observable<void> {
    return of();
  }

  public saveState(state: unknown): Observable<PersistenceOperationResult> {
    this.mockStore.setState(state);
    return this.mockSaveStateOperationResult$.pipe(take(1));
  }

  public mockSaveOperation(operationResult: PersistenceOperationResult): void {
    this.mockSaveStateOperationResult$.next(operationResult);
  }

  public getState(): Observable<unknown | null> {
    const currentState = this.mockStore.select((state: unknown) => state);
    return currentState ?? of(null);
  }
}
