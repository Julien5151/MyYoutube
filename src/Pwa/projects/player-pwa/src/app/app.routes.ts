import { Routes } from '@angular/router';
import { AdminComponent } from './modules/admin/admin.component';
import { UserManagementComponent } from './modules/admin/components/user-management/user-management.component';
import { AuthenticationComponent } from './modules/authentication/authentication.component';
import { LoginComponent } from './modules/authentication/components/login/login.component';
import { RegisterAdminComponent } from './modules/authentication/components/register-admin/register-admin.component';
import { MusicListComponent } from './modules/player/components/music-list/music-list.component';
import { PlaylistListComponent } from './modules/player/components/playlist-list/playlist-list.component';
import { SettingsComponent } from './modules/player/components/settings/settings.component';
import { playlistsResolver } from './modules/player/data/resolvers/playlists.resolver';
import { PlayerComponent } from './modules/player/player.component';
import { isAdminGuard } from './modules/shared/guards/is-admin.guard';
import { isLoggedGuard } from './modules/shared/guards/is-logged.guard';

export const AUTHENTICATION_ROUTE = 'authentication';
export const PLAYER_ROUTE = 'player';
export const PLAYLIST_ID_ROUTER_PARAM = 'playlistId';
export const MUSICS_ROUTE = 'musics';
export const PLAYLISTS_ROUTE = 'playlists';
export const SETTINGS_ROUTE = 'settings';
export const LOGIN_ROUTE = 'login';
export const REGISTER_ADMIN_ROUTE = 'register-admin';
export const ADMIN_ROUTE = 'admin';
export const USER_MANAGEMENT_ROUTE = 'user-management';

export const routes: Routes = [
  {
    path: AUTHENTICATION_ROUTE,
    component: AuthenticationComponent,
    children: [
      {
        path: LOGIN_ROUTE,
        component: LoginComponent,
      },
      {
        path: REGISTER_ADMIN_ROUTE,
        component: RegisterAdminComponent,
      },
    ],
  },
  {
    path: ADMIN_ROUTE,
    component: AdminComponent,
    canActivate: [isAdminGuard],
    children: [
      {
        path: USER_MANAGEMENT_ROUTE,
        component: UserManagementComponent,
      },
    ],
  },
  {
    path: PLAYER_ROUTE,
    component: PlayerComponent,
    canActivate: [isLoggedGuard],
    resolve: {
      playlists: playlistsResolver,
    },
    children: [
      {
        path: `:${PLAYLIST_ID_ROUTER_PARAM}/${MUSICS_ROUTE}`,
        component: MusicListComponent,
      },
      {
        path: PLAYLISTS_ROUTE,
        component: PlaylistListComponent,
      },
      {
        path: SETTINGS_ROUTE,
        component: SettingsComponent,
      },
    ],
  },
  { path: '', redirectTo: PLAYER_ROUTE, pathMatch: 'full' },
  { path: '**', redirectTo: PLAYER_ROUTE },
];
