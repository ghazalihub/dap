import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppHelper } from '../services/core/app-helper.service';

@Component({
  selector: 'app-section-card',
  template: `
    <mat-card class="rounded-xl shadow-md p-0 overflow-hidden">
      <div class="p-3 bg-white">
        <h3 class="text-gray-400 font-bold text-lg px-2">{{ i18n.translate('application') }}</h3>
      </div>

      <mat-list>
        <!-- About Us -->
        <mat-list-item (click)="goToAbout()" class="hover:bg-gray-100 cursor-pointer">
          <mat-icon matListItemIcon class="text-gray-400">info_outline</mat-icon>
          <div matListItemTitle class="font-medium text-black">{{ i18n.translate('about_us') }}</div>
          <mat-icon matListItemMeta>chevron_right</mat-icon>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- Share -->
        <mat-list-item (click)="shareApp()" class="hover:bg-gray-100 cursor-pointer">
          <mat-icon matListItemIcon class="text-gray-400">share</mat-icon>
          <div matListItemTitle class="font-medium text-black">{{ i18n.translate('share_with_friends') }}</div>
          <mat-icon matListItemMeta>chevron_right</mat-icon>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- Rate App -->
        <mat-list-item (click)="rateApp()" class="hover:bg-gray-100 cursor-pointer">
          <mat-icon matListItemIcon class="text-gray-400">star_outline</mat-icon>
          <div matListItemTitle class="font-medium text-black">{{ i18n.translate('rate_on_app_store') }}</div>
          <mat-icon matListItemMeta>chevron_right</mat-icon>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- Privacy Policy -->
        <mat-list-item (click)="openPrivacy()" class="hover:bg-gray-100 cursor-pointer">
          <mat-icon matListItemIcon class="text-gray-400">lock_outline</mat-icon>
          <div matListItemTitle class="font-medium text-black">{{ i18n.translate('privacy_policy') }}</div>
          <mat-icon matListItemMeta>chevron_right</mat-icon>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- Terms -->
        <mat-list-item (click)="openTerms()" class="hover:bg-gray-100 cursor-pointer">
          <mat-icon matListItemIcon class="text-gray-400">copyright</mat-icon>
          <div matListItemTitle class="font-medium text-black">{{ i18n.translate('terms_of_service') }}</div>
          <mat-icon matListItemMeta>chevron_right</mat-icon>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class AppSectionCardComponent {
  constructor(
    public i18n: AppLocalizations,
    private appHelper: AppHelper,
    private router: Router
  ) {}

  goToAbout() {
    this.router.navigate(['/about']);
  }

  shareApp() {
    this.appHelper.shareApp();
  }

  rateApp() {
    // appHelper.reviewApp behavior clone
  }

  openPrivacy() {
    this.appHelper.openPrivacyPage();
  }

  openTerms() {
    this.appHelper.openTermsPage();
  }
}
