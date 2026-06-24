import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { UsersService } from '../services/api/users.service';
import { DislikesService } from '../services/api/dislikes.service';
import { LikesService } from '../services/api/likes.service';
import { MatchesService } from '../services/api/matches.service';
import { VisitsService } from '../services/api/visits.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { ItsMatchDialogComponent } from '../components/its-match-dialog.component';
import { User } from '../models/user.model';
import { USER_ID, USER_DEVICE_TOKEN } from '../constants/constants';

@Component({
  selector: 'app-discover-tab',
  template: `
    <div class="h-full relative bg-gray-50">
      <div *ngIf="isLoading" class="h-full flex items-center justify-center">
        <app-processing [text]="i18n.translate('loading')"></app-processing>
      </div>

      <div *ngIf="!isLoading && users.length === 0" class="h-full">
        <app-no-data
          [title]="i18n.translate('no_user_found_around_you_please_try_again_later')">
        </app-no-data>
      </div>

      <div *ngIf="!isLoading && users.length > 0" class="h-full flex flex-col">
        <!-- Swipe Stack Placeholder (Logic implementation) -->
        <div class="flex-grow relative overflow-hidden p-4">
          <div *ngFor="let userDoc of users; let i = index"
               class="absolute inset-4 transition-transform duration-300"
               [style.z-index]="users.length - i"
               [class.hidden]="i !== currentIndex">
            <app-profile-card [user]="mapDocToUser(userDoc)" page="discover"></app-profile-card>
          </div>
        </div>

        <!-- Swipe Buttons -->
        <div class="flex justify-center items-center space-x-6 pb-8">
          <app-circle-button icon="restore" (clicked)="goToDisliked()"></app-circle-button>

          <app-circle-button
            icon="close" [size]="35"
            (clicked)="swipeLeft()">
          </app-circle-button>

          <app-circle-button
            icon="favorite_border" [size]="35" iconColor="primary"
            (clicked)="swipeRight()">
          </app-circle-button>

          <app-circle-button icon="visibility" (clicked)="viewProfile()"></app-circle-button>
        </div>
      </div>
    </div>
  `
})
export class DiscoverTabComponent implements OnInit {
  users: DocumentSnapshot<DocumentData>[] = [];
  currentIndex = 0;
  isLoading = true;

  constructor(
    private usersService: UsersService,
    private dislikesService: DislikesService,
    private likesService: LikesService,
    private matchesService: MatchesService,
    private visitsService: VisitsService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.dislikesService.getDislikedUsers(false).subscribe(async dislikedUsers => {
      this.usersService.getUsers(dislikedUsers).subscribe(users => {
        this.users = users;
        this.isLoading = false;
      });
    });
  }

  mapDocToUser(doc: DocumentSnapshot<DocumentData>): User {
     return this.userService.mapDocumentToUser(doc.data()!);
  }

  swipeLeft() {
    if (this.currentIndex >= this.users.length) return;
    const userDoc = this.users[this.currentIndex];
    this.dislikesService.dislikeUser(userDoc.get(USER_ID), (r) => console.log('Disliked:', r));
    this.currentIndex++;
  }

  async swipeRight() {
    if (this.currentIndex >= this.users.length) return;
    const userDoc = this.users[this.currentIndex];
    const user = this.mapDocToUser(userDoc);

    this.matchesService.checkMatch(user.userId, (isMatch) => {
      if (isMatch) {
        this.dialog.open(ItsMatchDialogComponent, {
          data: {
            matchedUser: user,
            showSwipeButton: true,
            onSwipeRight: () => { /* Logic to move to next card */ }
          },
          panelClass: 'full-screen-modal'
        });
      }
    });

    this.likesService.likeUser(
      user.userId,
      user.userDeviceToken,
      `${this.userService.currentUser?.userFullname.split(' ')[0]}, ${this.i18n.translate('liked_your_profile_click_and_see')}`,
      (r) => console.log('Liked:', r)
    );

    this.currentIndex++;
  }

  viewProfile() {
    if (this.currentIndex >= this.users.length) return;
    const user = this.mapDocToUser(this.users[this.currentIndex]);

    this.router.navigate(['/profile', user.userId], { state: { user, showButtons: false } });

    this.visitsService.visitUserProfile(
      user.userId,
      user.userDeviceToken,
      `${this.userService.currentUser?.userFullname.split(' ')[0]}, ${this.i18n.translate('visited_your_profile_click_and_see')}`
    );
  }

  goToDisliked() {
    this.router.navigate(['/disliked-profiles']);
  }
}
