/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { of, type Observer } from 'rxjs';

import { ObjectStoreName } from '../../enums/object-store-name.enum';
import { PersistenceOperationResult } from '../../enums/persistence-operation-result.enum';
import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  // Arrange
  let service: PersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(PersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should grant permission for persistence if storage persist API is available', async () => {
    // Arrange
    spyOn(navigator.storage, 'persist').and.resolveTo(true);
    // Act
    const permissionGranted = await service.askPermissionForPersistence();
    // Assert
    expect(permissionGranted).toBeTrue();
  });

  it('should throw error if storage persistence API is not available', async () => {
    // Arrange
    const savedPersistMethod = navigator.storage.persist;
    navigator.storage.persist = undefined as unknown as () => Promise<boolean>;
    // Act
    const callShouldThrow = (): Promise<boolean> | void => {
      return service.askPermissionForPersistence();
    };
    // Assert
    expect(callShouldThrow).toThrow(new Error('Storage Manager persistence not supported by this browser'));
    // Restore original method to avoid breaking other tests
    navigator.storage.persist = savedPersistMethod;
  });

  describe('when opening database connection', () => {
    // Arrange
    let fakeDatabase: jasmine.SpyObj<IDBDatabase>;
    let observer: jasmine.SpyObj<Observer<unknown>>;
    let fakeEvent: unknown;
    const fakeRequest = {
      onerror: (): void => {},
      onupgradeneeded: (event: unknown): void => {},
      onsuccess: (event: unknown): void => {},
    };

    beforeEach(() => {
      // Arrange
      fakeDatabase = jasmine.createSpyObj('database', ['createObjectStore', 'addEventListener']);
      fakeEvent = {
        target: {
          result: fakeDatabase,
        },
      };
      spyOn(globalThis.indexedDB, 'open').and.returnValue(fakeRequest as unknown as IDBOpenDBRequest);
      observer = jasmine.createSpyObj('observer', ['next', 'error']);
    });
    it('should create object stores and trigger next method of returned observable when opening connection is successful', () => {
      // Act
      service.openDatabase('philippeDB').subscribe(observer);
      fakeRequest.onupgradeneeded(fakeEvent);
      fakeRequest.onsuccess(fakeEvent);
      // Assert
      expect(observer.next).toHaveBeenCalled();
      expect(observer.error).not.toHaveBeenCalled();
      expect(fakeDatabase.createObjectStore).toHaveBeenCalledTimes(2);
      expect(fakeDatabase.createObjectStore).toHaveBeenCalledWith(ObjectStoreName.Store);
      expect(fakeDatabase.createObjectStore).toHaveBeenCalledWith(ObjectStoreName.Files);
    });

    it('should trigger error method of returned observable when opening connection started but triggered on error', () => {
      // Act
      service.openDatabase('philippeDB').subscribe(observer);
      fakeRequest.onerror();
      // Assert
      expect(observer.next).not.toHaveBeenCalled();
      expect(fakeDatabase.createObjectStore).not.toHaveBeenCalled();
      expect(observer.error).toHaveBeenCalledOnceWith('IndexedDB usage not allowed by user. No persistence (hence offline mode) possible');
    });
  });

  it('should trigger error method of returned observable when opening connection fails instantly', () => {
    // Arrange
    const errorMessage = 'Philippe connection failed';
    const dbName = 'philippeDB';
    spyOn(globalThis.indexedDB, 'open').and.throwError(new Error(errorMessage));
    const observer: jasmine.SpyObj<Observer<unknown>> = jasmine.createSpyObj('observer', ['next', 'error']);
    // Act
    service.openDatabase(dbName).subscribe(observer);
    // Assert
    expect(observer.next).not.toHaveBeenCalled();
    expect(observer.error).toHaveBeenCalledOnceWith(`Could not open database with name ${dbName} because of error : Error: ${String(errorMessage)}`);
  });

  it('should save state in database', () => {
    // Arrange
    const saveSpy = spyOn(service as any, 'saveItem');
    const fakeState = {
      philippe: 'Philippe !',
    };
    // Act
    service.saveState(fakeState);
    // Assert
    expect(saveSpy).toHaveBeenCalledOnceWith(fakeState, service['storeKey'], ObjectStoreName.Store);
  });

  it('should get state from database', () => {
    // Arrange
    const fakeState = {
      philippe: 'Philippe !',
    };
    const getSpy = spyOn(service as any, 'getItem').and.returnValue(of(fakeState));
    // Act
    service.getState().subscribe((state) => {
      // Assert
      expect(getSpy).toHaveBeenCalledOnceWith(service['storeKey'], ObjectStoreName.Store);
      expect(state).toEqual(fakeState);
    });
  });

  describe('when deleting database', () => {
    let closeSpy: jasmine.Spy;
    const fakeRequest = {
      onerror: (): void => {},
      onsuccess: (): void => {},
    };

    beforeEach(() => {
      closeSpy = jasmine.createSpy();
      service['database'] = { close: closeSpy } as unknown as IDBDatabase;
      spyOn(globalThis.indexedDB, 'deleteDatabase').and.returnValue(fakeRequest as unknown as IDBOpenDBRequest);
    });

    it('should not delete database and log error', () => {
      // Arrange
      const logErrorSpy = spyOn(console, 'error');
      // Act
      service.deleteDbAndReload('DB_PHILIPPE');
      fakeRequest.onerror();
      // Assert
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(globalThis.indexedDB.deleteDatabase).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledOnceWith('IndexedDB could not be deleted');
    });

    it('should delete database and reload', () => {
      // Arrange
      const reloadSpy = spyOn(service as any, 'reloadPage');
      // Act
      service.deleteDbAndReload('DB_PHILIPPE');
      fakeRequest.onsuccess();
      // Assert
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(globalThis.indexedDB.deleteDatabase).toHaveBeenCalledTimes(1);
      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when using generic functions', () => {
    [
      {
        methodToCall: 'successCallback' as const,
        expectedOperationResult: PersistenceOperationResult.Success,
        key: 'storeKey',
        objectStoreName: ObjectStoreName.Store,
      },
      {
        methodToCall: 'errorCallback' as const,
        expectedOperationResult: PersistenceOperationResult.Error,
        key: 'fileUuid',
        objectStoreName: ObjectStoreName.Files,
      },
    ].forEach(({ methodToCall, expectedOperationResult, key, objectStoreName }) => {
      it(`should save item in database ${expectedOperationResult === PersistenceOperationResult.Success ? 'successfully' : 'with error'}`, () => {
        // Arrange
        const fakeRequest = {
          successCallback: (): void => undefined,
          errorCallback: (): void => undefined,
          addEventListener: (operationResult: PersistenceOperationResult, callback: () => void): void => {
            fakeRequest[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
          },
        };
        const putSpy = jasmine.createSpy().and.returnValue(fakeRequest);
        const objectStoreSpy = jasmine.createSpy().and.returnValue({
          put: putSpy,
        });
        const transactionSpy = jasmine.createSpy().and.returnValue({
          objectStore: objectStoreSpy,
        });
        const fakeDatabase = {
          transaction: transactionSpy,
        };
        service['database'] = fakeDatabase as unknown as IDBDatabase;
        const fakeItem = {
          philippe: 'Philippe !',
        };
        // Act
        service.saveItem(fakeItem, key, objectStoreName).subscribe((operationResult) => {
          // Assert
          expect(transactionSpy).toHaveBeenCalledOnceWith([objectStoreName], 'readwrite');
          expect(objectStoreSpy).toHaveBeenCalledOnceWith(objectStoreName);
          expect(putSpy).toHaveBeenCalledOnceWith(fakeItem, key);
          expect(operationResult).toBe(expectedOperationResult);
        });
        fakeRequest[methodToCall]();
      });

      it(`should get item in database ${expectedOperationResult === PersistenceOperationResult.Success ? 'successfully' : 'with error'}`, () => {
        // Arrange
        const fakeItem = {
          philippe: 'Philippe !',
        };
        const fakeRequest = {
          successCallback: (): void => undefined,
          errorCallback: (): void => undefined,
          addEventListener: (operationResult: PersistenceOperationResult, callback: () => void): void => {
            fakeRequest[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
          },
          result: fakeItem,
        };
        const getSpy = jasmine.createSpy().and.returnValue(fakeRequest);
        const objectStoreSpy = jasmine.createSpy().and.returnValue({
          get: getSpy,
        });
        const transactionSpy = jasmine.createSpy().and.returnValue({
          objectStore: objectStoreSpy,
        });
        const fakeDatabase = {
          transaction: transactionSpy,
        };
        service['database'] = fakeDatabase as unknown as IDBDatabase;
        // Act
        service.getItem(key, objectStoreName).subscribe((item) => {
          // Assert
          expect(transactionSpy).toHaveBeenCalledOnceWith([objectStoreName], 'readonly');
          expect(objectStoreSpy).toHaveBeenCalledOnceWith(objectStoreName);
          expect(getSpy).toHaveBeenCalledOnceWith(key);
          expect(item).toEqual(expectedOperationResult === PersistenceOperationResult.Success ? fakeItem : null);
        });
        fakeRequest[methodToCall]();
      });

      it(`should get all items in database ${expectedOperationResult === PersistenceOperationResult.Success ? 'successfully' : 'with error'}`, () => {
        // Arrange
        const continueSpy = jasmine.createSpy();
        const fakeCursorWithValue = {
          primaryKey: 'itemUuid',
          value: 'Philippe',
          continue: continueSpy,
        };
        const fakeCursor = {
          successCallback: (event: {
            target: {
              result: typeof fakeCursorWithValue;
            };
          }): void => undefined,
          errorCallback: (event: {
            target: {
              result: typeof fakeCursorWithValue;
            };
          }): void => undefined,
          addEventListener: (
            operationResult: PersistenceOperationResult,
            callback: (event: {
              target: {
                result: typeof fakeCursorWithValue;
              };
            }) => void,
          ): void => {
            fakeCursor[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
          },
        };
        const openCursorSpy = jasmine.createSpy().and.returnValue(fakeCursor);
        const objectStoreSpy = jasmine.createSpy().and.returnValue({
          openCursor: openCursorSpy,
        });
        const transactionSpy = jasmine.createSpy().and.returnValue({
          objectStore: objectStoreSpy,
        });
        const fakeDatabase = {
          transaction: transactionSpy,
        };
        service['database'] = fakeDatabase as unknown as IDBDatabase;
        // Act
        service.getAllItems(objectStoreName).subscribe((items) => {
          // Assert
          expect(transactionSpy).toHaveBeenCalledOnceWith([objectStoreName], 'readonly');
          expect(objectStoreSpy).toHaveBeenCalledOnceWith(objectStoreName);
          expect(openCursorSpy).toHaveBeenCalledTimes(1);
          expect(items).toEqual(null);
        });
        fakeCursor[methodToCall]({
          target: {
            result: fakeCursorWithValue,
          },
        });
        expect(continueSpy).toHaveBeenCalledTimes(expectedOperationResult === PersistenceOperationResult.Success ? 1 : 0);
      });

      it(`should remove item from database ${expectedOperationResult === PersistenceOperationResult.Success ? 'successfully' : 'with error'}`, () => {
        // Arrange
        const fakeRequest = {
          successCallback: (): void => undefined,
          errorCallback: (): void => undefined,
          addEventListener: (operationResult: PersistenceOperationResult, callback: () => void): void => {
            fakeRequest[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
          },
        };
        const deleteSpy = jasmine.createSpy().and.returnValue(fakeRequest);
        const objectStoreSpy = jasmine.createSpy().and.returnValue({
          delete: deleteSpy,
        });
        const transactionSpy = jasmine.createSpy().and.returnValue({
          objectStore: objectStoreSpy,
        });
        const fakeDatabase = {
          transaction: transactionSpy,
        };
        service['database'] = fakeDatabase as unknown as IDBDatabase;
        const fakeKey = 'Philippe !';
        // Act
        service.removeItem(fakeKey, objectStoreName).subscribe((operationResult) => {
          // Assert
          expect(transactionSpy).toHaveBeenCalledOnceWith([objectStoreName], 'readwrite');
          expect(objectStoreSpy).toHaveBeenCalledOnceWith(objectStoreName);
          expect(deleteSpy).toHaveBeenCalledOnceWith(fakeKey);
          expect(operationResult).toBe(expectedOperationResult);
        });
        fakeRequest[methodToCall]();
      });
    });

    it('should return empty object when getting all items in database if there is no cursor', () => {
      // Arrange
      const fakeCursorWithValue: null = null;
      const fakeCursor = {
        successCallback: (event: {
          target: {
            result: typeof fakeCursorWithValue;
          };
        }): void => undefined,
        errorCallback: (event: {
          target: {
            result: typeof fakeCursorWithValue;
          };
        }): void => undefined,
        addEventListener: (
          operationResult: PersistenceOperationResult,
          callback: (event: {
            target: {
              result: typeof fakeCursorWithValue;
            };
          }) => void,
        ): void => {
          fakeCursor[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
        },
      };
      const openCursorSpy = jasmine.createSpy().and.returnValue(fakeCursor);
      const objectStoreSpy = jasmine.createSpy().and.returnValue({
        openCursor: openCursorSpy,
      });
      const transactionSpy = jasmine.createSpy().and.returnValue({
        objectStore: objectStoreSpy,
      });
      const fakeDatabase = {
        transaction: transactionSpy,
      };
      service['database'] = fakeDatabase as unknown as IDBDatabase;
      // Act
      service['getAllItems'](ObjectStoreName.Files).subscribe((items) => {
        // Assert
        expect(transactionSpy).toHaveBeenCalledOnceWith([ObjectStoreName.Files], 'readonly');
        expect(objectStoreSpy).toHaveBeenCalledOnceWith(ObjectStoreName.Files);
        expect(openCursorSpy).toHaveBeenCalledTimes(1);
        expect(items).toEqual({});
      });
      fakeCursor.successCallback({
        target: {
          result: fakeCursorWithValue,
        },
      });
    });

    it('should return null if requested item in not in database but request was successful', () => {
      // Arrange
      const fakeRequest = {
        successCallback: (): void => undefined,
        errorCallback: (): void => undefined,
        addEventListener: (operationResult: PersistenceOperationResult, callback: () => void): void => {
          fakeRequest[operationResult === PersistenceOperationResult.Success ? 'successCallback' : 'errorCallback'] = callback;
        },
      };
      const getSpy = jasmine.createSpy().and.returnValue(fakeRequest);
      const objectStoreSpy = jasmine.createSpy().and.returnValue({
        get: getSpy,
      });
      const transactionSpy = jasmine.createSpy().and.returnValue({
        objectStore: objectStoreSpy,
      });
      const fakeDatabase = {
        transaction: transactionSpy,
      };
      service['database'] = fakeDatabase as unknown as IDBDatabase;
      const fakeKey = 'key';
      const fakeObjectStoreName = 'objectStoreName' as ObjectStoreName;
      // Act
      service['getItem'](fakeKey, fakeObjectStoreName).subscribe((item) => {
        // Assert
        expect(transactionSpy).toHaveBeenCalledOnceWith([fakeObjectStoreName], 'readonly');
        expect(objectStoreSpy).toHaveBeenCalledOnceWith(fakeObjectStoreName);
        expect(getSpy).toHaveBeenCalledOnceWith(fakeKey);
        expect(item).toEqual(null);
      });
      fakeRequest.successCallback();
    });
  });

  describe('when using private methods', () => {
    it('should add global requests error handler', () => {
      // Arrange
      const fakeDatabase = {
        errorCallback: (event: unknown): void => undefined,
        addEventListener: (operationResult: PersistenceOperationResult, callback: () => void): void => {
          fakeDatabase.errorCallback = callback;
        },
      };
      service['database'] = fakeDatabase as unknown as IDBDatabase;
      const addEventListenerSpy = spyOn(fakeDatabase, 'addEventListener').and.callThrough();
      const errorSpy = spyOn(console, 'error');
      const fakeEvent = 'Philippe';
      // Act
      service['addGlobalRequestsErrorHandler']();
      fakeDatabase.errorCallback(fakeEvent);
      // Assert
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledOnceWith(`Database error: ${String(fakeEvent)}`);
    });
  });
});
