import { Component } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppHelper } from '../services/core/app-helper.service';
import { AppService } from '../services/core/app.service';
import { APP_NAME, APP_VERSION_NAME } from '../constants/constants';

@Component({
  selector: 'app-about',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('about_us') }}</h1>
      </header>

      <div class="flex-grow p-6 flex flex-col items-center text-center pb-24">
        <app-logo></app-logo>

        <h2 class="text-2xl font-bold mt-4">{{ APP_NAME }}</h2>
        <p class="text-gray-500 text-lg mt-2">{{ i18n.translate('app_short_description') }}</p>

        <p class="text-gray-700 text-lg mt-6 leading-relaxed">
          {{ i18n.translate('about_us_description') }}
        </p>

        <button mat-flat-button color="primary" class="mt-6 py-6 px-8 rounded-lg flex items-center" (click)="shareApp()">
           <mat-icon class="mr-2 text-white">share</mat-icon>
           <span class="text-lg">{{ i18n.translate('share_app') }}</span>
        </button>

        <p class="text-gray-400 font-bold text-xl mt-8">{{ APP_VERSION_NAME }}</p>

        <mat-divider class="w-full my-8"></mat-divider>

        <div class="space-y-4">
          <h3 class="text-lg font-bold text-gray-800">{{ i18n.translate('do_you_have_a_question') }}</h3>
          <p class="text-lg text-gray-600">{{ i18n.translate('send_your_message_to_our_email_address') }}</p>
          <p class="text-xl font-bold text-primary">{{ appService.currentUserAppInfo?.appEmail }}</p>
        </div>
      </div>
    </div>
  `
})
export class AboutPageComponent {
  APP_NAME = APP_NAME;
  APP_VERSION_NAME = APP_VERSION_NAME;

  constructor(
    public i18n: AppLocalizations,
    private appHelper: AppHelper,
    public appService: AppService
  ) {}

  goBack() {
    window.history.back();
  }

  shareApp() {
    this.appHelper.shareApp();
  }
}
