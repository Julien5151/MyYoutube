import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { OfflineManagementActions } from '../../../shared/store/offline-management/offline-management.actions';
import { selectIsOfflineOrOfflineForced } from '../../../shared/store/offline-management/offline-management.selectors';

@Component({
  selector: 'pwa-settings',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private readonly store = inject(Store);
  public readonly isOfflineOfOfflineForced$ = this.store.select(selectIsOfflineOrOfflineForced);

  public toggleOffline(toggleChecked: boolean): void {
    this.store.dispatch(toggleChecked ? OfflineManagementActions.toggleOnOfflineMode() : OfflineManagementActions.toggleOffOfflineMode());
  }
}
