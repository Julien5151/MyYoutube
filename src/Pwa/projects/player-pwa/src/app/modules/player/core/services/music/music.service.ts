import { HttpEvent } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../shared/services/api/api.service';
import { FileService } from '../../../../shared/services/file/file.service';
import { uuid } from '../../../../shared/types/uuid.type';
import { Music } from '../../models/music.entity';
import { Playlist } from '../../models/playlist.entity';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private readonly apiService = inject(ApiService);
  private readonly fileService = inject(FileService);

  public getMusicFile(fileOid: number): Observable<HttpEvent<Blob>> {
    return this.apiService.getFile(`musics/file/${fileOid}`);
  }

  public removeLocalMusicFile(fileOid: number): Observable<number> {
    return this.fileService.removeFile(fileOid);
  }

  public addMusic(url: string): Observable<{ music: Music; playlist: Playlist }> {
    return this.apiService.post<{ music: Music; playlist: Playlist }>('tracks', { url });
  }

  public deleteMusic(musicId: uuid): Observable<{ numberOfTracksDeleted: number }> {
    return this.apiService.delete<{ numberOfTracksDeleted: number }>(`tracks/${musicId}`);
  }
}
