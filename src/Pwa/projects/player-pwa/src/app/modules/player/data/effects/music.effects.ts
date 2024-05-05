import { HttpEvent, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { FileService } from '../../../shared/services/file/file.service';
import { MusicService } from '../../core/services/music/music.service';
import { MusicsActions } from '../../core/store/musics/musics.actions';

export const getMusicFileEffect = createEffect(
  (actions$ = inject(Actions), musicService = inject(MusicService)) => {
    return actions$.pipe(
      ofType(MusicsActions.getMusicFile),
      exhaustMap(({ oid, name }) =>
        musicService.getMusicFile(oid).pipe(
          map((blobEvent: HttpEvent<Blob>) => {
            if (blobEvent.type === HttpEventType.DownloadProgress) {
              return MusicsActions.getMusicFileProgress({ oid, progress: blobEvent.loaded / (blobEvent.total ?? 1) });
            } else if (blobEvent.type === HttpEventType.Response) {
              return MusicsActions.getMusicFileSuccess({ oid, file: new File([blobEvent.body!], name, { type: 'audio/mpeg3' }) });
            }
            return MusicsActions.getMusicFileFailed();
          }),
          catchError(() => of(MusicsActions.getMusicFileFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const persistMusicFileEffect = createEffect(
  (actions$ = inject(Actions), fileService = inject(FileService)) => {
    return actions$.pipe(
      ofType(MusicsActions.getMusicFileSuccess),
      exhaustMap(({ oid, file }) =>
        fileService.storeFile(file, oid).pipe(
          map((oid) => MusicsActions.storeMusicFileSuccess({ oid })),
          catchError(() => of(MusicsActions.storeMusicFileFailed({ oid }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const removeLocalMusicFileEffect = createEffect(
  (actions$ = inject(Actions), musicService = inject(MusicService)) => {
    return actions$.pipe(
      ofType(MusicsActions.removeLocalMusicFile),
      exhaustMap(({ oid }) =>
        musicService.removeLocalMusicFile(oid).pipe(
          map((oid) => MusicsActions.removeLocalMusicFileSuccess({ oid })),
          catchError(() => of(MusicsActions.removeLocalMusicFileFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const addMusicEffect = createEffect(
  (actions$ = inject(Actions), musicService = inject(MusicService)) => {
    return actions$.pipe(
      ofType(MusicsActions.addMusic),
      exhaustMap(({ url }) =>
        musicService.addMusic(url).pipe(
          map(({ music, playlist }) => MusicsActions.addMusicSuccess({ music, playlist })),
          catchError(() => of(MusicsActions.addMusicFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteMusicEffect = createEffect(
  (actions$ = inject(Actions), musicService = inject(MusicService)) => {
    return actions$.pipe(
      ofType(MusicsActions.deleteMusic),
      exhaustMap(({ musicId }) =>
        musicService.deleteMusic(musicId).pipe(
          map(({ numberOfTracksDeleted }) => {
            if (numberOfTracksDeleted === 1) return MusicsActions.deleteMusicSuccess({ musicId });
            return MusicsActions.deleteMusicFailed();
          }),
          catchError(() => of(MusicsActions.deleteMusicFailed())),
        ),
      ),
    );
  },
  { functional: true },
);
