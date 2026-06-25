import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { VisitsService } from '../services/api/visits.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { VipDialogComponent } from '../components/vip-dialog.component';
import { VISITED_BY_USER_ID } from '../constants/constants';

@Component({
  selector: 'app-profile-visits',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('visits') }}</h1>
      </header>

      <app-build-title svgIconName="visibility" [title]="i18n.translate('users_who_visited_you')"></app-build-title>

      <div class="flex-grow relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && userVisits.length === 0" class="h-full">
          <app-no-data [title]="i18n.translate('no_visit')"></app-no-data>
        </div>

        <div *ngIf="!isLoading && userVisits.length > 0" class="p-2 overflow-y-auto h-full">
          <div class="grid grid-cols-2 gap-0">
             <div *ngFor="let doc of userVisits" class="aspect-[250/320] cursor-pointer" (click)="viewProfile(doc)">
                <app-match-card-wrapper [userId]="doc.get(VISITED_BY_USER_ID)"></app-match-card-wrapper>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileVisitsPageComponent implements OnInit {
  userVisits: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;
  VISITED_BY_USER_ID = VISITED_BY_USER_ID;

  constructor(
    private visitsService: VisitsService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.visitsService.getUserVisits().subscribe(users => {
      this.userVisits = users;
      this.isLoading = false;
    });
  }

  goBack() {
    window.history.back();
  }

  async viewProfile(doc: DocumentSnapshot<DocumentData>) {
    const userId = doc.get(VISITED_BY_USER_ID);
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
