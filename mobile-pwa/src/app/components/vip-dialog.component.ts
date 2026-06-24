import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppService } from '../services/core/app.service';
import { AppHelper } from '../services/core/app-helper.service';

@Component({
  selector: 'app-vip-dialog',
  template: `
    <div class="max-h-screen overflow-y-auto p-1 bg-gray-100">
      <mat-card class="overflow-hidden rounded-lg">
        <div class="relative bg-primary text-white text-center pb-4">
          <button mat-icon-button (click)="close()" class="absolute top-0 right-0 text-white">
            <mat-icon>cancel</mat-icon>
          </button>

          <div class="pt-6 pb-2 flex justify-center">
            <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
               <img src="assets/images/crow_badge.png" class="w-16 h-16">
            </div>
          </div>

          <h2 class="text-2xl font-bold mb-2">{{ i18n.translate('vip_account') }}</h2>

          <div class="flex items-center px-4">
            <div class="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
               <img [src]="userService.currentUser?.userProfilePhoto" class="w-full h-full object-cover">
            </div>
            <p class="text-sm">
              {{ i18n.translate('hello') }} {{ userService.currentUser?.userFullname?.split(' ')[0] }},
              {{ i18n.translate('become_a_vip_member_and_enjoy_the_benefits_below') }}
            </p>
          </div>
        </div>

        <!-- VIP Plans Placeholder -->
        <div class="bg-gray-200 p-4">
          <h3 class="font-bold text-lg mb-2">{{ i18n.translate('vip_subscriptions') }}</h3>
          <mat-divider class="mb-4"></mat-divider>

          <!-- StoreProducts component would go here -->
          <div class="text-center py-4 bg-white rounded shadow-sm mb-4">
             <p class="text-gray-500 italic">Subscription list loading...</p>
          </div>

          <div class="text-center py-4">
            <p class="text-sm mb-2">{{ i18n.translate('have_you_already_purchased_a_VIP_account') }}</p>
            <button mat-stroked-button (click)="restoreSubscription()" class="rounded-full bg-white">
              <mat-icon>refresh</mat-icon>
              {{ i18n.translate('restore_subscription') }}
            </button>
          </div>
        </div>

        <!-- Benefits -->
        <div class="bg-white p-4">
          <h3 class="font-bold text-lg mb-2">{{ i18n.translate('benefits') }}</h3>
          <mat-divider class="mb-2"></mat-divider>

          <mat-list>
            <!-- Passport -->
            <mat-list-item>
              <mat-icon matListItemIcon class="bg-primary text-white rounded-full p-1">flight</mat-icon>
              <div matListItemTitle class="font-semibold">{{ i18n.translate('passport') }}</div>
              <div matListItemLine class="text-xs text-wrap">{{ i18n.translate('travel_to_any_country_or_city_and_match_with_people_there') }}</div>
            </mat-list-item>
            <mat-divider></mat-divider>

            <!-- Discover more people -->
            <mat-list-item>
              <mat-icon matListItemIcon class="bg-purple-500 text-white rounded-full p-1">location_on</mat-icon>
              <div matListItemTitle class="font-semibold">{{ i18n.translate('discover_more_people') }}</div>
              <div matListItemLine class="text-xs text-wrap">
                {{ i18n.translate('get') }} {{ appService.currentUserAppInfo?.vipAccountMaxDistance }} km {{ i18n.translate('radius_away') }}
              </div>
            </mat-list-item>
            <mat-divider></mat-divider>

            <!-- Add more pictures -->
            <mat-list-item>
              <mat-icon matListItemIcon class="bg-green-500 text-white rounded-full p-1">camera_alt</mat-icon>
              <div matListItemTitle class="font-semibold">{{ i18n.translate('add_more_pictures_on_your_profile_gallery') }}</div>
              <div matListItemLine class="text-xs text-wrap">{{ i18n.translate('make_your_profile_attractive_by_adding_more_photos') }}</div>
            </mat-list-item>
            <mat-divider></mat-divider>

            <!-- See who liked you -->
            <mat-list-item>
              <mat-icon matListItemIcon class="bg-pink-400 text-white rounded-full p-1">favorite</mat-icon>
              <div matListItemTitle class="font-semibold">{{ i18n.translate('see_people_who_liked_you') }}</div>
              <div matListItemLine class="text-xs text-wrap">{{ i18n.translate('unravel_the_mystery_and_find_out_who_liked_you') }}</div>
            </mat-list-item>
            <mat-divider></mat-divider>

             <!-- Verified badge -->
            <mat-list-item>
              <img matListItemIcon src="assets/images/verified_badge.png" class="w-8 h-8">
              <div matListItemTitle class="font-semibold">{{ i18n.translate('verified_account_badge') }}</div>
              <div matListItemLine class="text-xs text-wrap">{{ i18n.translate('let_other_users_know_that_you_are_a_real_person') }}</div>
            </mat-list-item>
            <mat-divider></mat-divider>

            <!-- No Ads -->
            <mat-list-item>
              <mat-icon matListItemIcon class="bg-red-500 text-white rounded-full p-1">block</mat-icon>
              <div matListItemTitle class="font-semibold">{{ i18n.translate('no_ads') }}</div>
              <div matListItemLine class="text-xs text-wrap">{{ i18n.translate('have_a_unique_experience') }}</div>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-list-item { height: auto !important; padding-top: 8px; padding-bottom: 8px; }
    .text-wrap { white-space: normal; }
  `]
})
export class VipDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VipDialogComponent>,
    public i18n: AppLocalizations,
    public userService: UserService,
    public appService: AppService,
    private appHelper: AppHelper
  ) {}

  close() {
    this.dialogRef.close();
  }

  async restoreSubscription() {
    console.log(this.i18n.translate('processing'));
    await this.appHelper.restoreVipAccount(true);
  }
}
