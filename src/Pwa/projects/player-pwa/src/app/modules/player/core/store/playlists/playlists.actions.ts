import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Playlist } from '../../models/playlist.entity';

export const PlaylistsActions = createActionGroup({
  source: 'Playlists',
  events: {
    GetPlaylists: emptyProps(),
    GetPlaylistsSuccess: props<{ playlists: Array<Playlist> }>(),
    GetPlaylistsFailed: emptyProps(),
  },
});
