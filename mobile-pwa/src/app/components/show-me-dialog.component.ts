import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { USER_SETTINGS, USER_SHOW_ME } from '../constants/constants';

@Component({
  selector: 'app-show-me-dialog',
  template: `
    <div class="p-4">
      <div class="flex items-center mb-4">
        <mat-icon class="mr-2">wc</mat-icon>
        <h2 class="text-xl font-bold">{{ i18n.translate('show_me') }}</h2>
      </div>
      <mat-divider class="mb-2"></mat-divider>

      <mat-radio-group [(ngModel)]="selectedOption" class="flex flex-col mb-4">
        <mat-radio-button *ngFor="let option of options" [value]="option.value" class="mb-2">
          {{ option.label }}
        </mat-radio-button>
      </mat-radio-group>

      <mat-divider class="mb-2"></mat-divider>

      <div class="flex justify-around p-2">
        <button mat-button (click)="close()" class="text-gray-500">
          {{ i18n.translate('CANCEL') }}
        </button>
        <button mat-button color="primary" [disabled]="!selectedOption" (click)="save()">
          {{ i18n.translate('SAVE').toUpperCase() }}
        </button>
      </div>
    </div>
  `
})
export class ShowMeDialogComponent {
  selectedOption = '';
  options: { label: string, value: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<ShowMeDialogComponent>,
    public i18n: AppLocalizations,
    private userService: UserService
  ) {
    this.options = [
      { label: this.i18n.translate('women'), value: 'women' },
      { label: this.i18n.translate('men'), value: 'men' },
      { label: this.i18n.translate('everyone'), value: 'everyone' }
    ];

    const showMe = this.userService.currentUser?.userSettings?.[USER_SHOW_ME];
    if (showMe) {
      this.selectedOption = showMe;
    }
  }

  close() {
    this.dialogRef.close();
  }

  async save() {
    const userId = this.userService.currentUser?.userId;
    if (userId) {
      await this.userService.updateUserData(userId, {
        [`${USER_SETTINGS}.${USER_SHOW_ME}`]: this.selectedOption
      });
      this.dialogRef.close(true);
    }
  }
}
