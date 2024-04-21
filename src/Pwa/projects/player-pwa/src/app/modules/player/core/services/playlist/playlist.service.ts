import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../shared/services/api/api.service';
import { Playlist } from '../../models/playlist.entity';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly apiService = inject(ApiService);

  public getPlaylists(): Observable<Array<Playlist>> {
    return this.apiService.get<Array<Playlist>>('playlists');
  }
}
