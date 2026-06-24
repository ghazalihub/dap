import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/core/user.service';
import { AppHelper } from '../services/core/app-helper.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ReportDialogComponent } from './report-dialog.component';

@Component({
  selector: 'app-profile-card',
  template: `
    <div class="p-2 h-full relative">
      <div class="h-full rounded-xl overflow-hidden shadow-lg relative bg-gray-200">
        <!-- User Image -->
        <img [src]="userPhoto"
             class="w-full h-full object-cover"
             [class.object-contain]="requireVip">

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>

        <!-- User Info Container -->
        <div class="absolute bottom-0 left-0 p-4 w-full">
          <h2 class="text-white font-bold" [class.text-xl]="page === 'discover'" [class.text-lg]="page !== 'discover'">
            {{ user.userFullname }}, {{ userAge }}
          </h2>

          <div class="flex items-center text-white mt-1">
            <mat-icon class="text-white text-sm mr-1">location_on</mat-icon>
            <span class="text-sm truncate">{{ user.userLocality }}, {{ user.userCountry }}</span>
          </div>

          <!-- Bottom spacing for discover tab -->
          <div *ngIf="page === 'discover'" class="h-16"></div>
        </div>

        <!-- Location Badge -->
        <div class="absolute top-2 left-2">
          <div class="bg-primary bg-opacity-80 text-white px-2 py-1 rounded text-xs flex items-center">
            <mat-icon *ngIf="page === 'discover'" class="text-xs mr-1 h-3 w-3">location_on</mat-icon>
            {{ distance }}km
          </div>
        </div>

        <!-- Like/Dislike indicators (Handled by swipe stack in actual UI) -->

        <!-- Message Icon for Matches -->
        <div *ngIf="page === 'matches'" class="absolute bottom-2 right-2 bg-primary rounded-full p-2 shadow">
          <mat-icon class="text-white">message</mat-icon>
        </div>

        <!-- Report Button -->
        <div *ngIf="page === 'discover'" class="absolute top-0 right-0">
          <button mat-icon-button (click)="openReport($event)" class="text-primary">
            <mat-icon>flag</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileCardComponent implements OnInit {
  @Input() user!: User;
  @Input() page?: string;

  userPhoto: string = '';
  userAge: number = 0;
  requireVip: boolean = false;
  distance: number = 0;

  constructor(
    private userService: UserService,
    private appHelper: AppHelper,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.requireVip = this.page === 'require_vip' && !this.userService.userIsVip;
    this.userPhoto = this.requireVip ? 'assets/images/crow_badge.png' : this.user.userProfilePhoto;

    const birthDate = new Date(this.user.userBirthYear, this.user.userBirthMonth - 1, this.user.userBirthDay);
    this.userAge = this.userService.calculateUserAge(birthDate);

    this.distance = this.appHelper.getDistanceBetweenUsers(
      this.user.userGeoPoint.latitude,
      this.user.userGeoPoint.longitude
    );
  }

  openReport(event: Event) {
    event.stopPropagation();
    this.bottomSheet.open(ReportDialogComponent, {
      data: { userId: this.user.userId }
    });
  }
}
