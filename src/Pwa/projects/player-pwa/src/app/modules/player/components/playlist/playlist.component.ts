import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Playlist } from '../../core/models/playlist.entity';

@Component({
  selector: 'pwa-playlist',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './playlist.component.html',
})
export class PlaylistComponent {
  @Input({ required: true }) playlist!: Playlist;
}
