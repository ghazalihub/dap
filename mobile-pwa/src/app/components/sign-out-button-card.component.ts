import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AuthService } from '../services/core/auth.service';

@Component({
  selector: 'app-sign-out-button-card',
  template: `
    <mat-card class="rounded-xl shadow-md overflow-hidden cursor-pointer" (click)="signOut()">
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>exit_to_app</mat-icon>
          <div matListItemTitle class="font-bold text-lg">
            {{ i18n.translate('sign_out') }}
          </div>
          <mat-icon matListItemMeta>arrow_forward</mat-icon>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class SignOutButtonCardComponent {
  constructor(
    public i18n: AppLocalizations,
    private authService: AuthService,
    private router: Router
  ) {}

  async signOut() {
    await this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }
}
