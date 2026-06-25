import { Component } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { ANDROID_MAPS_API_KEY } from '../constants/constants';

@Component({
  selector: 'app-passport',
  template: `
    <div class="h-screen flex flex-col bg-white">
      <header class="flex items-center p-4 border-b bg-white">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('travel_to_any_country_or_city') }}</h1>
      </header>

      <div class="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <mat-icon class="text-gray-300 text-6xl mb-4 h-20 w-20">map</mat-icon>
        <h2 class="text-xl font-bold text-gray-700">{{ i18n.translate('passport') }}</h2>
        <p class="text-gray-500 mt-2">Map and location picker for PWA would be implemented using Google Maps JS SDK here.</p>

        <div class="mt-8 bg-gray-100 p-4 rounded-lg w-full max-w-sm italic text-sm text-gray-400">
           [Behavioral Clone: PlacePicker UI placeholder]
        </div>
      </div>
    </div>
  `
})
export class PassportPageComponent {
  constructor(public i18n: AppLocalizations) {}

  goBack() {
    window.history.back();
  }
}
