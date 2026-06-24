import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { BlockedUsersService } from '../services/api/blocked-users.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { FlagUserDialogComponent } from './flag-user-dialog.component';

@Component({
  selector: 'app-report-dialog',
  template: `
    <div class="bg-white rounded-t-lg">
      <div class="flex justify-between items-center p-4">
        <span class="text-gray-500 text-lg">{{ i18n.translate('select_an_option') }}</span>
        <button mat-icon-button (click)="close()">
          <mat-icon class="text-gray-500">cancel</mat-icon>
        </button>
      </div>
      <mat-divider></mat-divider>

      <div class="flex flex-col py-2">
        <button mat-button class="py-4 text-red-500" (click)="reportProfile()">
          <div class="flex items-center justify-center">
            <mat-icon class="mr-2">flag</mat-icon>
            <span class="text-lg font-semibold">{{ i18n.translate('report').toUpperCase() }}</span>
          </div>
        </button>
        <mat-divider></mat-divider>
        <button mat-button class="py-4 text-red-500" (click)="blockProfile()">
          <div class="flex items-center justify-center">
            <mat-icon class="mr-2">block</mat-icon>
            <span class="text-lg font-semibold">{{ i18n.translate('BLOCK') }}</span>
          </div>
        </button>
      </div>
      <div class="h-4"></div>
    </div>
  `
})
export class ReportDialogComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ReportDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { userId: string },
    public i18n: AppLocalizations,
    private dialog: MatDialog,
    private blockedUsersService: BlockedUsersService,
    private mobileDialogService: MobileDialogService
  ) {}

  close() {
    this.bottomSheetRef.dismiss();
  }

  reportProfile() {
    this.bottomSheetRef.dismiss();
    this.dialog.open(FlagUserDialogComponent, {
      data: { flaggedUserId: this.data.userId }
    });
  }

  blockProfile() {
    this.bottomSheetRef.dismiss();
    this.mobileDialogService.confirmDialog({
      message: this.i18n.translate('this_profile_will_be_blocked'),
      positiveAction: async () => {
        const success = await this.blockedUsersService.blockUser(this.data.userId).toPromise();
        if (success) {
           console.log(this.i18n.translate("user_has_been_blocked"));
        } else {
           console.log(this.i18n.translate("you_have_already_blocked_this_user"));
        }
      }
    });
  }
}
