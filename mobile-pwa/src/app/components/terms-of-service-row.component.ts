import { Component, Input } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppHelper } from '../services/core/app-helper.service';

@Component({
  selector: 'app-terms-of-service-row',
  template: `
    <div class="flex items-center justify-center space-x-2 font-bold text-base" [style.color]="color">
      <a class="underline cursor-pointer" (click)="openTerms()">{{ i18n.translate('terms_of_service') }}</a>
      <span>|</span>
      <a class="underline cursor-pointer" (click)="openPrivacy()">{{ i18n.translate('privacy_policy') }}</a>
    </div>
  `
})
export class TermsOfServiceRowComponent {
  @Input() color: string = 'white';

  constructor(
    public i18n: AppLocalizations,
    private appHelper: AppHelper
  ) {}

  openTerms() {
    this.appHelper.openTermsPage();
  }

  openPrivacy() {
    this.appHelper.openPrivacyPage();
  }
}
