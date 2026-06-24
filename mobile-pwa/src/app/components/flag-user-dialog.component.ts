import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-flag-user-dialog',
  template: `
    <div class="p-4">
      <div class="flex items-center mb-4">
        <mat-icon class="mr-2">flag</mat-icon>
        <h2 class="text-xl font-bold">{{ i18n.translate('report') }}</h2>
      </div>
      <mat-divider class="mb-2"></mat-divider>

      <mat-radio-group [(ngModel)]="selectedFlagOption" class="flex flex-col mb-4">
        <mat-radio-button *ngFor="let option of flagOptions" [value]="option" class="mb-2" (change)="onOptionChange(option)">
          {{ option }}
        </mat-radio-button>
      </mat-radio-group>

      <div *ngIf="isOtherSelected" class="mb-4 px-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ i18n.translate('type_the_reason') }}</mat-label>
          <input matInput [(ngModel)]="otherReason" [placeholder]="i18n.translate('type_the_reason')">
        </mat-form-field>
      </div>

      <mat-divider class="mb-2"></mat-divider>

      <div class="flex justify-around p-2">
        <button mat-button (click)="close()" class="text-gray-500">
          {{ i18n.translate('CANCEL') }}
        </button>
        <button mat-button color="primary" [disabled]="!selectedFlagOption" (click)="reportUser()">
          {{ i18n.translate('report').toUpperCase() }}
        </button>
      </div>
    </div>
  `
})
export class FlagUserDialogComponent {
  selectedFlagOption = '';
  isOtherSelected = false;
  otherReason = '';
  flagOptions: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<FlagUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { flaggedUserId: string },
    public i18n: AppLocalizations,
    private userService: UserService
  ) {
    this.flagOptions = [
      this.i18n.translate("sexual_content"),
      this.i18n.translate("abusive_content"),
      this.i18n.translate("violent_content"),
      this.i18n.translate("inappropriate_content"),
      this.i18n.translate("spam_or_misleading"),
      this.i18n.translate("other"),
    ];
  }

  onOptionChange(option: string) {
    this.isOtherSelected = option === this.i18n.translate('other');
  }

  close() {
    this.dialogRef.close();
  }

  async reportUser() {
    const finalReason = this.isOtherSelected ? this.otherReason : this.selectedFlagOption;
    if (this.isOtherSelected && !this.otherReason) return;

    await this.userService.flagUserProfile(this.data.flaggedUserId, finalReason);
    this.dialogRef.close(true);
    // Note: Success message handling would be in the caller or via a notification service
  }
}
