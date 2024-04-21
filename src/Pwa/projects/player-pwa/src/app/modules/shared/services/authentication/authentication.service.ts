import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../enums/role.enum';
import { uuid } from '../../types/uuid.type';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly apiService = inject(ApiService);

  public login(email: string, password: string): Observable<{ userId: uuid; email: string; role: Role }> {
    return this.apiService.post<{ userId: uuid; email: string; role: Role }>('authentication/login', { email, password });
  }

  public logout(): Observable<void> {
    return this.apiService.post<void>('authentication/logout', {});
  }

  public registerAdmin(email: string, password: string): Observable<void> {
    return this.apiService.post<void>('authentication/register-admin', { email, password });
  }
}
