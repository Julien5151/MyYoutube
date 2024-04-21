import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { PlaylistService } from '../../core/services/playlist/playlist.service';
import { MusicsActions } from '../../core/store/musics/musics.actions';
import { PlaylistsActions } from '../../core/store/playlists/playlists.actions';

export const getPlaylistsEffect = createEffect(
  (actions$ = inject(Actions), playlistsService = inject(PlaylistService)) => {
    return actions$.pipe(
      ofType(PlaylistsActions.getPlaylists),
      exhaustMap(() =>
        playlistsService.getPlaylists().pipe(
          map((playlists) => PlaylistsActions.getPlaylistsSuccess({ playlists })),
          catchError(() => of(PlaylistsActions.getPlaylistsFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const reloadPlaylistsEffect = createEffect(
  (actions$ = inject(Actions), playlistsService = inject(PlaylistService)) => {
    return actions$.pipe(
      ofType(MusicsActions.addMusicSuccess, MusicsActions.deleteMusicSuccess),
      exhaustMap(() =>
        playlistsService.getPlaylists().pipe(
          map((playlists) => PlaylistsActions.getPlaylistsSuccess({ playlists })),
          catchError(() => of(PlaylistsActions.getPlaylistsFailed())),
        ),
      ),
    );
  },
  { functional: true },
);
