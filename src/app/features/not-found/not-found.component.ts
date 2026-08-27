import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 2rem;">
      <mat-icon style="font-size: 80px; width: 80px; height: 80px; color: var(--mat-sys-primary); margin-bottom: 1rem;">error_outline</mat-icon>
      <h1 class="mat-headline-2" style="margin-bottom: 0.5rem;">Page Not Found</h1>
      <p class="mat-body-1" style="color: var(--mat-sys-on-surface-variant); max-width: 400px; margin-bottom: 2rem;">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a mat-flat-button color="primary" routerLink="/">Return to Home</a>
    </div>
  `
})
export class NotFoundComponent {}
