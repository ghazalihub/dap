import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DislikesService } from '../services/api/dislikes.service';
import { VisitsService } from '../services/api/visits.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { VipDialogComponent } from '../components/vip-dialog.component';
import { DISLIKED_USER_ID } from '../constants/constants';

@Component({
  selector: 'app-disliked-profiles',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('disliked_profiles') }}</h1>
      </header>

      <app-build-title svgIconName="close" [title]="i18n.translate('profiles_you_rejected')"></app-build-title>

      <div class="flex-grow relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && dislikedUsers.length === 0" class="h-full">
          <app-no-data [title]="i18n.translate('no_dislike')"></app-no-data>
        </div>

        <div *ngIf="!isLoading && dislikedUsers.length > 0" class="p-2 overflow-y-auto h-full">
          <div class="grid grid-cols-2 gap-0">
             <div *ngFor="let doc of dislikedUsers" class="aspect-[250/320] cursor-pointer" (click)="viewProfile(doc)">
                <app-match-card-wrapper [userId]="doc.get(DISLIKED_USER_ID)"></app-match-card-wrapper>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DislikedProfilesPageComponent implements OnInit {
  dislikedUsers: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;
  DISLIKED_USER_ID = DISLIKED_USER_ID;

  constructor(
    private dislikesService: DislikesService,
    private visitsService: VisitsService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dislikesService.getDislikedUsers(true).subscribe(users => {
      this.dislikedUsers = users;
      this.isLoading = false;
    });
  }

  goBack() {
    window.history.back();
  }

  async viewProfile(doc: DocumentSnapshot<DocumentData>) {
    const userId = doc.get(DISLIKED_USER_ID);
    const user = await this.userService.getUserObject(userId);

    if (this.userService.userIsVip) {
      this.router.navigate(['/profile', userId], { state: { user, hideDislikeButton: true, fromDislikesScreen: true } });

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
