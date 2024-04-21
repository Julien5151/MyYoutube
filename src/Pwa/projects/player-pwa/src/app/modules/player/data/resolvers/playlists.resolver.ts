import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, tap } from 'rxjs';
import { selectIsOfflineOrOfflineForced } from '../../../shared/store/offline-management/offline-management.selectors';
import { Playlist } from '../../core/models/playlist.entity';
import { PlaylistsActions } from '../../core/store/playlists/playlists.actions';
import { selectAllPlaylists } from '../../core/store/playlists/playlists.selectors';

export const playlistsResolver: ResolveFn<Array<Playlist>> = () => {
  const store = inject(Store);
  return store.select(selectIsOfflineOrOfflineForced).pipe(
    tap((isOfflineOrOfflineForced) => {
      if (!isOfflineOrOfflineForced) store.dispatch(PlaylistsActions.getPlaylists());
    }),
    switchMap((isOfflineOrOfflineForced) => {
      const playlists$ = store.select(selectAllPlaylists);
      if (isOfflineOrOfflineForced) return playlists$;
      return playlists$.pipe(filter((playlists) => playlists.length > 0));
    }),
  );
};
