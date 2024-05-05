import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { uuid } from '../../../../shared/types/uuid.type';
import { Music } from '../../models/music.entity';
import { Playlist } from '../../models/playlist.entity';

export const MusicsActions = createActionGroup({
  source: 'Musics',
  events: {
    GetMusicFile: props<{ oid: number; name: string }>(),
    GetMusicFileProgress: props<{ oid: number; progress: number }>(),
    GetMusicFileSuccess: props<{ oid: number; file: File }>(),
    GetMusicFileFailed: emptyProps(),
    RemoveLocalMusicFile: props<{ oid: number }>(),
    RemoveLocalMusicFileSuccess: props<{ oid: number }>(),
    RemoveLocalMusicFileFailed: emptyProps(),
    DeleteMusic: props<{ musicId: uuid }>(),
    DeleteMusicSuccess: props<{ musicId: uuid }>(),
    DeleteMusicFailed: emptyProps(),
    StoreMusicFileSuccess: props<{ oid: number }>(),
    StoreMusicFileFailed: props<{ oid: number }>(),
    AddMusic: props<{ url: string }>(),
    AddMusicSuccess: props<{ music: Music; playlist: Playlist }>(),
    AddMusicFailed: emptyProps(),
  },
});
