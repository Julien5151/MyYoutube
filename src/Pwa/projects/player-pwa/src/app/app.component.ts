import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdateService } from './modules/shared/services/sw/sw-update.service';

@Component({
  selector: 'pwa-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly swUpdateService = inject(SwUpdateService);
  public ngOnInit(): void {
    this.swUpdateService.initCheckingForUpdate();
  }
}
