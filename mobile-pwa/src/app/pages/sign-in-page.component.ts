import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { APP_NAME } from '../constants/constants';

@Component({
  selector: 'app-sign-in',
  template: `
    <div class="h-screen w-screen relative bg-cover bg-center" style="background-image: url('assets/images/background_image.jpg');">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary to-black opacity-60"></div>

      <div class="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center text-white">
        <app-logo></app-logo>
        <h1 class="text-3xl font-bold mt-4">{{ APP_NAME }}</h1>

        <p class="text-xl mt-6 font-medium">{{ i18n.translate('welcome_back') }}</p>
        <p class="text-lg mt-2 opacity-90">{{ i18n.translate('app_short_description') }}</p>

        <div class="w-full max-w-xs mt-12">
          <app-default-button
            [label]="i18n.translate('sign_in_with_phone_number')"
            (clicked)="goToPhoneNumber()">
          </app-default-button>
        </div>

        <div class="mt-8 text-sm font-bold">
          <p>{{ i18n.translate('by_tapping_log_in_you_agree_with_our') }}</p>
          <div class="flex justify-center space-x-2 mt-2 underline">
             <a (click)="openTerms()">Terms</a>
             <span>&</span>
             <a (click)="openPrivacy()">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignInPageComponent {
  APP_NAME = APP_NAME;

  constructor(
    public i18n: AppLocalizations,
    private router: Router
  ) {}

  goToPhoneNumber() {
    this.router.navigate(['/phone-number']);
  }

  openTerms() {
     window.open('https://example.com/terms', '_blank');
  }

  openPrivacy() {
     window.open('https://example.com/privacy', '_blank');
  }
}
