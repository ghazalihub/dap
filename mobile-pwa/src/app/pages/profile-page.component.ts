import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { AppHelper } from '../services/core/app-helper.service';
import { DislikesService } from '../services/api/dislikes.service';
import { LikesService } from '../services/api/likes.service';
import { MatchesService } from '../services/api/matches.service';
import { ReportDialogComponent } from '../components/report-dialog.component';
import { ItsMatchDialogComponent } from '../components/its-match-dialog.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile-screen',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <!-- Transparent Overlay AppBar -->
      <header class="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-2">
        <button mat-icon-button (click)="goBack()" class="bg-white bg-opacity-50">
          <mat-icon class="text-primary">arrow_back</mat-icon>
        </button>

        <button *ngIf="isOtherUser()" mat-icon-button (click)="openReport()" class="bg-white bg-opacity-50">
          <mat-icon class="text-primary">flag</mat-icon>
        </button>
      </header>

      <!-- Profile Images Carousel -->
      <div class="w-full aspect-square bg-gray-200">
         <!-- Simple image switcher for PWA -->
         <img [src]="profileImages[currentImgIndex]" class="w-full h-full object-cover">
         <div *ngIf="profileImages.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            <div *ngFor="let img of profileImages; let i = index"
                 (click)="currentImgIndex = i"
                 class="w-2 h-2 rounded-full cursor-pointer"
                 [class.bg-primary]="currentImgIndex === i"
                 [class.bg-white]="currentImgIndex !== i"></div>
         </div>
      </div>

      <!-- Profile Details -->
      <div class="p-4 flex-grow pb-24">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <h2 class="text-2xl font-bold mr-2">{{ user.userFullname }}, {{ userAge }}</h2>
            <img *ngIf="user.userIsVerified" src="assets/images/verified_badge.png" class="w-6 h-6 mr-1">
            <img *ngIf="isCurrentUser() && userService.userIsVip" src="assets/images/crow_badge.png" class="w-5 h-5">
          </div>

          <div class="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <mat-icon class="text-sm mr-1">location_on</mat-icon>
            {{ distance }}km
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center text-gray-700">
            <mat-icon class="text-primary mr-3">location_on</mat-icon>
            <span class="text-lg">{{ user.userLocality }}, {{ user.userCountry }}</span>
          </div>

          <div *ngIf="user.userJobTitle" class="flex items-center text-gray-700">
            <mat-icon class="text-primary mr-3">work</mat-icon>
            <span class="text-lg">{{ user.userJobTitle }}</span>
          </div>

          <div *ngIf="user.userSchool" class="flex items-center text-gray-700">
            <mat-icon class="text-primary mr-3">school</mat-icon>
            <span class="text-lg">{{ user.userSchool }}</span>
          </div>

          <div class="flex items-center text-gray-700">
            <mat-icon class="text-primary mr-3">cake</mat-icon>
            <span class="text-lg">{{ i18n.translate('birthday') }} {{ user.userBirthYear }}/{{ user.userBirthMonth }}/{{ user.userBirthDay }}</span>
          </div>
        </div>

        <mat-divider class="my-6"></mat-divider>

        <h3 class="text-xl font-bold text-primary mb-2">{{ i18n.translate('bio') }}</h3>
        <p class="text-gray-600 text-lg leading-relaxed">{{ user.userBio }}</p>
      </div>

      <!-- Action Buttons -->
      <div *ngIf="showButtons && isOtherUser()" class="fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 flex justify-around">
        <app-circle-button
           *ngIf="!hideDislikeButton"
           icon="close" [size]="35" bgColor="gray-200" iconColor="primary"
           (clicked)="dislikeProfile()">
        </app-circle-button>

        <app-circle-button
           icon="favorite_border" [size]="35" bgColor="primary" iconColor="white"
           (clicked)="likeProfile()">
        </app-circle-button>
      </div>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  user!: User;
  showButtons: boolean = true;
  hideDislikeButton: boolean = false;
  fromDislikesScreen: boolean = false;

  profileImages: string[] = [];
  currentImgIndex = 0;
  userAge: number = 0;
  distance: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    public i18n: AppLocalizations,
    private appHelper: AppHelper,
    private dislikesService: DislikesService,
    private likesService: LikesService,
    private matchesService: MatchesService,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
      this.showButtons = navigation.extras.state['showButtons'] ?? true;
      this.hideDislikeButton = navigation.extras.state['hideDislikeButton'] ?? false;
      this.fromDislikesScreen = navigation.extras.state['fromDislikesScreen'] ?? false;
    }
  }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/home']);
      return;
    }

    this.profileImages = this.userService.getUserProfileImages(this.user);
    const birthDate = new Date(this.user.userBirthYear, this.user.userBirthMonth - 1, this.user.userBirthDay);
    this.userAge = this.userService.calculateUserAge(birthDate);
    this.distance = this.appHelper.getDistanceBetweenUsers(this.user.userGeoPoint.latitude, this.user.userGeoPoint.longitude);
  }

  isCurrentUser() {
    return this.userService.currentUser?.userId === this.user.userId;
  }

  isOtherUser() {
    return !this.isCurrentUser();
  }

  goBack() {
    window.history.back();
  }

  openReport() {
    this.bottomSheet.open(ReportDialogComponent, { data: { userId: this.user.userId } });
  }

  dislikeProfile() {
    this.dislikesService.dislikeUser(this.user.userId, (success) => {
      if (success) {
        this.goBack();
      } else {
        console.log(this.i18n.translate("you_already_disliked_this_profile"));
      }
    });
  }

  async likeProfile() {
    this.matchesService.checkMatch(this.user.userId, (isMatch) => {
      if (isMatch) {
        this.dialog.open(ItsMatchDialogComponent, {
          data: { matchedUser: this.user, showSwipeButton: false },
          panelClass: 'full-screen-modal'
        });
      }
    });

    this.likesService.likeUser(
      this.user.userId,
      this.user.userDeviceToken,
      `${this.userService.currentUser?.userFullname.split(' ')[0]}, ${this.i18n.translate("liked_your_profile_click_and_see")}`,
      async (success) => {
        if (success) {
           console.log(`${this.i18n.translate("like_sent_to")} ${this.user.userFullname}`);
           if (this.fromDislikesScreen) {
              await this.dislikesService.deleteDislikedUser(this.user.userId);
           }
           this.goBack();
        } else {
           console.log(this.i18n.translate("you_already_liked_this_profile"));
        }
      }
    );
  }
}
