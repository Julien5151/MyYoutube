import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { FileService } from '../../../shared/services/file/file.service';
import { Music } from '../../core/models/music.entity';
import { MusicsActions } from '../../core/store/musics/musics.actions';
import { HideIfOfflineDirective } from '../../directives/hide-if-offline.directive';

@Component({
  selector: 'pwa-music',
  standalone: true,
  imports: [CommonModule, MatIconModule, HideIfOfflineDirective],
  templateUrl: './music.component.html',
})
export class MusicComponent implements OnInit {
  @Input({ required: true }) music!: Music;

  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly fileService = inject(FileService);

  public fileObjectUrl: string | null = null;

  constructor() {
    this.handleGetMusicFileSuccess();
    this.handleMusicFileDeletion();
  }

  public ngOnInit(): void {
    this.fileService.getFile(this.music.oid).subscribe({
      next: (file) => {
        this.fileObjectUrl = URL.createObjectURL(file);
      },
      error: () => {
        this.fileObjectUrl = null;
      },
    });
  }

  public downloadFile(): void {
    this.store.dispatch(MusicsActions.getMusicFile({ name: this.music.title, oid: this.music.oid }));
  }

  public deleteMusic(): void {
    this.store.dispatch(MusicsActions.deleteMusic({ musicId: this.music.id }));
  }

  public clearLocalFile(): void {
    this.store.dispatch(MusicsActions.removeLocalMusicFile({ oid: this.music.oid }));
  }

  private handleGetMusicFileSuccess(): void {
    this.actions$
      .pipe(
        ofType(MusicsActions.getMusicFileSuccess),
        filter((action) => action.oid === this.music.oid),
        tap((action) => {
          this.fileObjectUrl = URL.createObjectURL(action.file);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private handleMusicFileDeletion(): void {
    this.actions$
      .pipe(
        ofType(MusicsActions.removeLocalMusicFileSuccess),
        filter((action) => action.oid === this.music.oid),
        tap(() => {
          this.fileObjectUrl = null;
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
