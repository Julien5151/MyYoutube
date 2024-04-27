import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/configuration/app.config';

// Main entry point
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
