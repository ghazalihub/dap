import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/core/user.service';
import { AppService } from '../services/core/app.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ShowMeDialogComponent } from '../components/show-me-dialog.component';
import { VipDialogComponent } from '../components/vip-dialog.component';
import {
  USER_MAX_DISTANCE,
  USER_MIN_AGE,
  USER_MAX_AGE,
  USER_SETTINGS,
  USER_SHOW_ME,
  USER_STATUS
} from '../constants/constants';

@Component({
  selector: 'app-settings',
  template: `
    <div class="h-screen flex flex-col bg-gray-50 overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('settings') }}</h1>
      </header>

      <div class="p-2 space-y-4">
        <!-- Passport -->
        <mat-card class="p-4 rounded-xl shadow-sm border border-pink-100">
           <h3 class="text-primary font-bold text-lg mb-2">{{ i18n.translate('passport') }}</h3>
           <div class="flex items-center">
              <mat-icon class="text-primary text-4xl mr-4 h-10 w-10">flight</mat-icon>
              <p class="text-sm flex-grow pr-2">{{ i18n.translate('travel_to_any_country_or_city_and_match_with_people_there') }}</p>
              <button mat-flat-button color="primary" class="rounded-lg h-9" (click)="travelNow()">
                {{ i18n.translate('travel_now') }}
              </button>
           </div>
        </mat-card>

        <!-- Current Location -->
        <mat-card class="p-4 rounded-xl shadow-sm">
           <h3 class="font-bold text-lg mb-2">{{ i18n.translate('your_current_location') }}</h3>
           <div class="flex items-center">
              <mat-icon class="text-primary mr-3">location_on</mat-icon>
              <span class="flex-grow">{{ userService.currentUser?.userCountry }}, {{ userService.currentUser?.userLocality }}</span>
              <button mat-flat-button color="primary" class="rounded-lg h-9" (click)="updateLocation()">
                {{ i18n.translate('UPDATE') }}
              </button>
           </div>
        </mat-card>

        <!-- Max Distance -->
        <mat-card class="p-4 rounded-xl shadow-sm">
           <div class="flex flex-col mb-4">
              <h3 class="font-bold text-lg">{{ i18n.translate('maximum_distance') }} {{ maxDistance }} km</h3>
              <p class="text-xs text-gray-400">{{ i18n.translate('show_people_within_this_radius') }}</p>
           </div>
           <mat-slider min="0" [max]="allowedMaxDistance" step="1" discrete class="w-full">
              <input matSliderThumb [(ngModel)]="maxDistance" (change)="onDistanceChange($event)">
           </mat-slider>
           <p *ngIf="!userService.userIsVip" class="text-primary text-xs mt-2">
             {{ i18n.translate('need_more_radius_away') }} {{ appService.currentUserAppInfo?.vipAccountMaxDistance }} km {{ i18n.translate('radius_away') }}
           </p>
        </mat-card>

        <!-- Age Range -->
        <mat-card class="p-4 rounded-xl shadow-sm">
           <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-lg">{{ i18n.translate('age_range') }}</h3>
                <p class="text-xs text-gray-400">{{ i18n.translate('show_people_within_this_age_range') }}</p>
              </div>
              <span class="font-bold text-lg">{{ minAge }} - {{ maxAge }}</span>
           </div>
           <!-- Simplified range slider for PWA -->
           <div class="px-2">
              <input type="range" min="18" max="100" [(ngModel)]="minAge" (change)="onAgeChange()" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
              <input type="range" min="18" max="100" [(ngModel)]="maxAge" (change)="onAgeChange()" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4">
           </div>
        </mat-card>

        <!-- Show Me -->
        <mat-card class="rounded-xl shadow-sm overflow-hidden clickable" (click)="openShowMe()">
           <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon class="text-primary">wc</mat-icon>
                <div matListItemTitle class="font-medium">{{ i18n.translate('show_me') }}</div>
                <div matListItemMeta class="text-primary font-bold">{{ currentShowMe }}</div>
              </mat-list-item>
           </mat-list>
        </mat-card>

        <!-- Hide Profile -->
        <mat-card class="p-4 rounded-xl shadow-sm">
           <div class="flex items-center">
              <mat-icon class="text-primary mr-3">{{ isHidden ? 'visibility_off' : 'visibility' }}</mat-icon>
              <div class="flex-grow">
                 <h3 class="font-bold text-base">{{ i18n.translate('hide_profile') }}</h3>
                 <p class="text-xs" [class.text-red-500]="isHidden" [class.text-green-500]="!isHidden">
                   {{ isHidden ? i18n.translate('your_profile_is_hidden_on_discover_tab') : i18n.translate('your_profile_is_visible_on_discover_tab') }}
                 </p>
              </div>
              <mat-slide-toggle color="primary" [(ngModel)]="isHidden" (change)="onHiddenToggle($event.checked)"></mat-slide-toggle>
           </div>
        </mat-card>
      </div>

      <div class="h-10"></div>
    </div>
  `
})
export class SettingsPageComponent implements OnInit {
  maxDistance = 0;
  minAge = 18;
  maxAge = 100;
  isHidden = false;
  allowedMaxDistance = 100;
  currentShowMe = '';

  constructor(
    public userService: UserService,
    public appService: AppService,
    public i18n: AppLocalizations,
    private dialog: MatDialog,
    private mobileDialogService: MobileDialogService
  ) {}

  ngOnInit() {
    const user = this.userService.currentUser;
    if (user && user.userSettings) {
      this.maxDistance = user.userSettings[USER_MAX_DISTANCE];
      this.minAge = user.userSettings[USER_MIN_AGE];
      this.maxAge = user.userSettings[USER_MAX_AGE];
      this.isHidden = user.userStatus === 'hidden';
      this.currentShowMe = this.i18n.translate(user.userSettings[USER_SHOW_ME] || 'everyone');

      this.allowedMaxDistance = this.userService.userIsVip
        ? (this.appService.currentUserAppInfo?.vipAccountMaxDistance || 200)
        : (this.appService.currentUserAppInfo?.freeAccountMaxDistance || 100);
    }
  }

  goBack() {
    window.history.back();
  }

  travelNow() {
    if (this.userService.userIsVip) {
      // Navigate to passport
    } else {
      this.dialog.open(VipDialogComponent);
    }
  }

  updateLocation() {
    // Call location update logic
  }

  async onDistanceChange(event: any) {
    const userId = this.userService.currentUser?.userId;
    if (userId) {
       await this.userService.updateUserData(userId, {
         [`${USER_SETTINGS}.${USER_MAX_DISTANCE}`]: this.maxDistance
       });
    }
  }

  async onAgeChange() {
    const userId = this.userService.currentUser?.userId;
    if (userId) {
       await this.userService.updateUserData(userId, {
         [`${USER_SETTINGS}.${USER_MIN_AGE}`]: Number(this.minAge),
         [`${USER_SETTINGS}.${USER_MAX_AGE}`]: Number(this.maxAge)
       });
    }
  }

  async onHiddenToggle(value: boolean) {
    const userId = this.userService.currentUser?.userId;
    if (userId) {
       await this.userService.updateUserData(userId, {
         [USER_STATUS]: value ? 'hidden' : 'active'
       });
    }
  }

  openShowMe() {
    this.dialog.open(ShowMeDialogComponent).afterClosed().subscribe(res => {
      if (res) {
         this.currentShowMe = this.i18n.translate(this.userService.currentUser?.userSettings?.[USER_SHOW_ME] || 'everyone');
      }
    });
  }
}
