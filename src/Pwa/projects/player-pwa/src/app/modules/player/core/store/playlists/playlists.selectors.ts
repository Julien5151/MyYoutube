import { createSelector } from '@ngrx/store';
import { Playlist } from '../../models/playlist.entity';
import { playlistsFeature } from './playlists.feature';

export const selectAllPlaylists = createSelector(
  playlistsFeature.selectPlaylistsState,
  (state) => Object.values(state.entities).filter((playlist) => !!playlist) as Array<Playlist>,
);
