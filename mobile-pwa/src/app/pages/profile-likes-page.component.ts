import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { LikesService } from '../services/api/likes.service';
import { VisitsService } from '../services/api/visits.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { VipDialogComponent } from '../components/vip-dialog.component';
import { LIKED_BY_USER_ID } from '../constants/constants';

@Component({
  selector: 'app-profile-likes',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('likes') }}</h1>
      </header>

      <app-build-title svgIconName="favorite" [title]="i18n.translate('users_who_liked_you')"></app-build-title>

      <div class="flex-grow relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && likedMeUsers.length === 0" class="h-full">
          <app-no-data [title]="i18n.translate('no_like')"></app-no-data>
        </div>

        <div *ngIf="!isLoading && likedMeUsers.length > 0" class="p-2 overflow-y-auto h-full">
          <div class="grid grid-cols-2 gap-0">
             <div *ngFor="let doc of likedMeUsers" class="aspect-[250/320] cursor-pointer" (click)="viewProfile(doc)">
                <app-match-card-wrapper [userId]="doc.get(LIKED_BY_USER_ID)"></app-match-card-wrapper>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileLikesPageComponent implements OnInit {
  likedMeUsers: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;
  LIKED_BY_USER_ID = LIKED_BY_USER_ID;

  constructor(
    private likesService: LikesService,
    private visitsService: VisitsService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.likesService.getLikedMeUsers().subscribe(users => {
      this.likedMeUsers = users;
      this.isLoading = false;
    });
  }

  goBack() {
    window.history.back();
  }

  async viewProfile(doc: DocumentSnapshot<DocumentData>) {
    const userId = doc.get(LIKED_BY_USER_ID);
    const user = await this.userService.getUserObject(userId);

    if (this.userService.userIsVip) {
      this.router.navigate(['/profile', userId], { state: { user, hideDislikeButton: true } });

      this.visitsService.visitUserProfile(
        user.userId,
        user.userDeviceToken,
        `${this.userService.currentUser?.userFullname.split(' ')[0]}, ${this.i18n.translate("visited_your_profile_click_and_see")}`
      );
    } else {
      this.dialog.open(VipDialogComponent);
    }
  }
}
