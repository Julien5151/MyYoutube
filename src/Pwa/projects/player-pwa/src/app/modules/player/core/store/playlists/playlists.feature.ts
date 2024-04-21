import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Playlist } from '../../models/playlist.entity';
import { PlaylistsActions } from './playlists.actions';

interface PlaylistsState extends EntityState<Playlist> {}

const playlistsAdapter: EntityAdapter<Playlist> = createEntityAdapter<Playlist>();

const playlistsInitialState: PlaylistsState = playlistsAdapter.getInitialState();

const playlistsReducer = createReducer(
  playlistsInitialState,
  on(PlaylistsActions.getPlaylists, PlaylistsActions.getPlaylistsFailed, (state) => {
    return playlistsAdapter.removeAll(state);
  }),
  on(PlaylistsActions.getPlaylistsSuccess, (state, { playlists }) => {
    return playlistsAdapter.setAll(playlists, state);
  }),
);

export const playlistsFeature = createFeature({
  name: 'playlists',
  reducer: playlistsReducer,
});
