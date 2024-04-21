import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../shared/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);

  public signup(email: string, password: string): Observable<void> {
    return this.apiService.post<void>('authentication/signup', { email, password });
  }
}
