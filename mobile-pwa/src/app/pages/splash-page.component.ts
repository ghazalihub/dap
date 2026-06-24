import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '../services/core/app-helper.service';
import { AuthService } from '../services/core/auth.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { APP_NAME, ANDROID_APP_VERSION_NUMBER } from '../constants/constants';

@Component({
  selector: 'app-splash',
  template: `
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <app-logo></app-logo>
      <h1 class="text-3xl font-bold mt-4">{{ APP_NAME }}</h1>
      <p class="text-gray-500 text-lg mt-2">{{ i18n.translate('app_short_description') }}</p>

      <div class="mt-8">
        <app-my-circular-progress></app-my-circular-progress>
      </div>
    </div>
  `
})
export class SplashPageComponent implements OnInit {
  APP_NAME = APP_NAME;

  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private authService: AuthService,
    public i18n: AppLocalizations
  ) {}

  async ngOnInit() {
    // Initial localization load
    await this.i18n.load();

    const storeVersion = await this.appHelper.getAppStoreVersion();
    const appCurrentVersion = ANDROID_APP_VERSION_NUMBER; // Base reference for PWA

    if (storeVersion > appCurrentVersion) {
      this.router.navigate(['/update-app']);
    } else {
      await this.authService.authUserAccount({
        homeScreen: () => this.router.navigate(['/home']),
        signUpScreen: () => this.router.navigate(['/sign-up']),
        updateLocationScreen: () => this.router.navigate(['/update-location']),
        signInScreen: () => this.router.navigate(['/sign-in']),
        blockedScreen: () => this.router.navigate(['/blocked-account'])
      });
    }
  }
}
