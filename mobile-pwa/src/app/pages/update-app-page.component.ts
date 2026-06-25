import { Component } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppHelper } from '../services/core/app-helper.service';
import { APP_NAME } from '../constants/constants';

@Component({
  selector: 'app-update-app',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10">
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('update_application') }}</h1>
      </header>

      <div class="flex-grow p-6 flex flex-col items-center text-center">
        <app-logo></app-logo>

        <h2 class="text-2xl font-bold mt-4">{{ APP_NAME }}</h2>

        <p class="text-primary text-xl font-bold mt-6">
          {{ i18n.translate('app_new_version') }}
        </p>

        <p class="text-lg mt-4">{{ i18n.translate('please_install_it_now') }}</p>
        <p class="text-lg text-gray-500 mt-2">{{ i18n.translate('don_worry_your_data_will_not_be_lost') }}</p>

        <mat-divider class="w-full my-6"></mat-divider>

        <p class="text-lg mb-6">{{ i18n.translate('click_this_button_to_install') }}</p>

        <button (click)="openStore()" class="w-full max-w-xs focus:outline-none transform active:scale-95 transition-transform">
           <img src="assets/images/google_play_badge.png" class="w-full">
        </button>
      </div>
    </div>
  `
})
export class UpdateAppPageComponent {
  APP_NAME = APP_NAME;

  constructor(
    public i18n: AppLocalizations,
    private appHelper: AppHelper
  ) {}

  openStore() {
    // In a real PWA context, you'd show install prompt or link to store
    // appHelper.openAppStore(); behavior clone
  }
}
