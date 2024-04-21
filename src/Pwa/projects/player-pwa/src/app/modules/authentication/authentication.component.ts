import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pwa-authentication',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {}
