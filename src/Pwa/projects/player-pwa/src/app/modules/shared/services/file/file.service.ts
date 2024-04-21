import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import { ObjectStoreName } from '../../enums/object-store-name.enum';
import { PersistenceOperationResult } from '../../enums/persistence-operation-result.enum';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly persistenceService = inject(PersistenceService);

  public storeFile(file: File, oid: number): Observable<number> {
    return this.persistenceService.saveItem<File>(file, oid, ObjectStoreName.Files).pipe(
      map((operationResult) => {
        if (operationResult === PersistenceOperationResult.Success) return oid;
        throw new Error(`File ${file.name} could not be save in indexedDB`);
      }),
    );
  }

  public getFile(oid: number): Observable<File> {
    return this.persistenceService.getItem<File>(oid, ObjectStoreName.Files).pipe(
      map((file) => {
        if (!file) throw new Error(`File with oid ${oid} could not be retrieved from indexedDB`);
        return file;
      }),
    );
  }

  public getAllFiles(): Observable<Record<number, File> | null> {
    return this.persistenceService.getAllItems<File>(ObjectStoreName.Files);
  }

  public removeFile(oid: number): Observable<number> {
    return this.persistenceService.removeItem(oid, ObjectStoreName.Files).pipe(
      map((operationResult) => {
        if (operationResult === PersistenceOperationResult.Success) return oid;
        throw new Error(`File with oid ${oid} could not be removed from indexedDB`);
      }),
    );
  }
}
