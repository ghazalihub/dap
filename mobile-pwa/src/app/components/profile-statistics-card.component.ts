import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-profile-statistics-card',
  template: `
    <mat-card class="bg-gray-100 p-0 rounded-xl shadow-md overflow-hidden">
      <mat-list>
        <!-- LIKES -->
        <mat-list-item (click)="goToLikes()" class="cursor-pointer hover:bg-gray-200">
          <mat-icon matListItemIcon class="text-primary">favorite</mat-icon>
          <div matListItemTitle class="font-medium text-black">
            {{ i18n.translate('LIKES') }}
          </div>
          <div matListItemMeta>
            <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {{ userService.currentUser?.userTotalLikes || 0 }}
            </div>
          </div>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- VISITS -->
        <mat-list-item (click)="goToVisits()" class="cursor-pointer hover:bg-gray-200">
          <mat-icon matListItemIcon class="text-primary">visibility</mat-icon>
          <div matListItemTitle class="font-medium text-black">
            {{ i18n.translate('VISITS') }}
          </div>
          <div matListItemMeta>
            <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {{ userService.currentUser?.userTotalVisits || 0 }}
            </div>
          </div>
        </mat-list-item>
        <mat-divider></mat-divider>

        <!-- DISLIKED PROFILES -->
        <mat-list-item (click)="goToDisliked()" class="cursor-pointer hover:bg-gray-200">
          <mat-icon matListItemIcon class="text-primary">close</mat-icon>
          <div matListItemTitle class="font-medium text-black">
            {{ i18n.translate('DISLIKED_PROFILES') }}
          </div>
          <div matListItemMeta>
            <div class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {{ userService.currentUser?.userTotalDisliked || 0 }}
            </div>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class ProfileStatisticsCardComponent {
  constructor(
    public userService: UserService,
    public i18n: AppLocalizations,
    private router: Router
  ) {}

  goToLikes() {
    this.router.navigate(['/profile-likes']);
  }

  goToVisits() {
    this.router.navigate(['/profile-visits']);
  }

  goToDisliked() {
    this.router.navigate(['/disliked-profiles']);
  }
}
