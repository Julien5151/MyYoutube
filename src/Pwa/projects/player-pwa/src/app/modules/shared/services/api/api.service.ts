import { HttpClient, HttpErrorResponse, HttpEvent, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, UnaryFunction, catchError, pipe } from 'rxjs';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE } from '../../../../app.routes';
import { AuthenticationActions } from '../../store/authentication/authentication.actions';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = '/api';
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  public get<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/${endpoint}`).pipe(this.handleError());
  }

  public getFile(endpoint: string): Observable<HttpEvent<Blob>> {
    return this.httpClient
      .get(`${this.baseUrl}/${endpoint}`, { observe: 'events', responseType: 'blob', reportProgress: true })
      .pipe(this.handleError());
  }

  public post<T>(endpoint: string, payload: unknown): Observable<T> {
    return this.httpClient.post<T>(`${this.baseUrl}/${endpoint}`, payload).pipe(this.handleError());
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.httpClient.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(this.handleError());
  }

  private handleError<T>(): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.Forbidden:
          case HttpStatusCode.Unauthorized:
            this.store.dispatch(AuthenticationActions.logout());
            this.router.navigate([AUTHENTICATION_ROUTE, LOGIN_ROUTE]);
            break;
        }
        throw error;
      }),
    );
  }
}
