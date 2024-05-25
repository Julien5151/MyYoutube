import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { PLAYLIST_ID_ROUTER_PARAM } from '../../../../app.routes';
import { selectIsOfflineOrOfflineForced } from '../../../shared/store/offline-management/offline-management.selectors';
import { selectAllPlaylists } from '../../core/store/playlists/playlists.selectors';
import { MusicComponent } from '../music/music.component';

@Component({
  selector: 'pwa-music-list',
  standalone: true,
  imports: [CommonModule, MusicComponent],
  templateUrl: './music-list.component.html',
})
export class MusicListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);

  public readonly isOfflineOfOfflineForced$ = this.store.select(selectIsOfflineOrOfflineForced);
  public readonly musics$ = this.store.select(selectAllPlaylists).pipe(
    withLatestFrom(this.activatedRoute.paramMap),
    map(([playlists, paramMap]) => {
      const selectedPlaylistId = paramMap.get(PLAYLIST_ID_ROUTER_PARAM)!;
      return playlists.find((playlist) => playlist.id === selectedPlaylistId)?.musics ?? [];
    }),
  );
}
