import { ApplicationConfig, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { Store, provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from '../app.routes';
import * as userEffects from '../modules/admin/data/effects/user.effects';
import { playlistsFeature } from '../modules/player/core/store/playlists/playlists.feature';
import * as musicEffects from '../modules/player/data/effects/music.effects';
import * as playlistEffects from '../modules/player/data/effects/playlist.effects';
import { PersistenceService } from '../modules/shared/services/persistence/persistence.service';
import * as authenticationEffects from '../modules/shared/store/authentication/authentication.effects';
import { authenticationFeature } from '../modules/shared/store/authentication/authentication.feature';
import { hydrateState } from '../modules/shared/store/meta-management/store-meta-management.meta-reducer';
import { OfflineManagementEffects } from '../modules/shared/store/offline-management/offline-management.effects';
import { offlineManagementFeature } from '../modules/shared/store/offline-management/offline-management.feature';
import { initializeAppFactory } from './app-initializer-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideStore(undefined, { metaReducers: [hydrateState] }),
    provideState(authenticationFeature),
    provideState(offlineManagementFeature),
    provideState(playlistsFeature),
    provideEffects(authenticationEffects, playlistEffects, musicEffects, userEffects, OfflineManagementEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAppInitializer(() => {
      const initializerFn = initializeAppFactory(inject(PersistenceService), inject(Store));
      return initializerFn();
    }),
  ],
};
