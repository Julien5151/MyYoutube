import { Directive, ElementRef, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectIsOfflineOrOfflineForced } from '../../shared/store/offline-management/offline-management.selectors';

@Directive({
  selector: '[pwaHideIfOffline]',
  standalone: true,
})
export class HideIfOfflineDirective {
  private readonly store = inject(Store);
  private readonly isOfflineOfOfflineForced$ = this.store.select(selectIsOfflineOrOfflineForced);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer2 = inject(Renderer2);

  constructor() {
    this.isOfflineOfOfflineForced$.pipe(takeUntilDestroyed()).subscribe((offlineForced) => {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'display', offlineForced ? 'none' : 'block');
    });
  }
}
