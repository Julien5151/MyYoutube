import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AUTHENTICATION_ROUTE, LOGIN_ROUTE, MUSICS_ROUTE, PLAYLISTS_ROUTE, SETTINGS_ROUTE } from '../../app.routes';
import { AuthenticationActions } from '../shared/store/authentication/authentication.actions';
import { AddMusicDialogComponent } from './components/add-music-dialog/add-music-dialog.component';
import { MY_TITLES_PLAYLIST } from './core/constants/playlists';
import { Playlist } from './core/models/playlist.entity';
import { MusicsActions } from './core/store/musics/musics.actions';
import { HideIfOfflineDirective } from './directives/hide-if-offline.directive';

@Component({
  selector: 'pwa-player',
  imports: [RouterOutlet, CommonModule, MatToolbarModule, MatIconModule, RouterLink, MatButtonModule, RouterLinkActive, HideIfOfflineDirective],
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {
  @Input() playlists: Array<Playlist> = [];

  public navItems = [
    { icon: 'home', routerLink: `./1/${MUSICS_ROUTE}` },
    { icon: 'view_list', routerLink: `./${PLAYLISTS_ROUTE}` },
    { icon: 'settings', routerLink: `./${SETTINGS_ROUTE}` },
  ];

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  public ngOnInit(): void {
    this.navigateToHome();
  }

  public addMusic() {
    const dialogRef = this.dialog.open(AddMusicDialogComponent);
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((url) => {
        if (url) this.store.dispatch(MusicsActions.addMusic({ url }));
      });
  }

  public logout(): void {
    this.store.dispatch(AuthenticationActions.logout());
    this.actions$.pipe(ofType(AuthenticationActions.logoutSuccess), take(1)).subscribe(() => {
      this.router.navigate([AUTHENTICATION_ROUTE, LOGIN_ROUTE]);
    });
  }

  private navigateToHome(): void {
    const myTitlesId = this.playlists.find((playlist) => playlist.title == MY_TITLES_PLAYLIST)?.id;
    if (myTitlesId) {
      const myTilesRoute = `./${myTitlesId}/${MUSICS_ROUTE}`;
      this.navItems[0].routerLink = myTilesRoute;
      this.router.navigate([myTilesRoute], { relativeTo: this.activatedRoute });
    }
  }
}
