import { Component } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppService } from '../services/core/app.service';

@Component({
  selector: 'app-blocked-account',
  template: `
    <div class="h-screen w-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
      <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6">
        <mat-icon class="text-white text-5xl">lock_outline</mat-icon>
      </div>

      <h2 class="text-xl font-bold text-gray-800">{{ i18n.translate('oops') }}</h2>
      <h3 class="text-2xl font-bold text-gray-800 my-2">{{ i18n.translate('your_account_was_blocked') }}</h3>
      <p class="text-gray-600 text-lg mb-4">{{ i18n.translate('please_contact_support_to_active_it') }}</p>

      <p class="text-xl font-bold text-primary">{{ appService.currentUserAppInfo?.appEmail }}</p>
    </div>
  `
})
export class BlockedAccountPageComponent {
  constructor(
    public i18n: AppLocalizations,
    public appService: AppService
  ) {}
}
