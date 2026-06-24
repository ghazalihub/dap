import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-mobile-common-dialog',
  template: `
    <h2 mat-dialog-title>
      <div class="flex items-center">
        <span class="mr-2" [innerHTML]="data.icon"></span>
        {{ data.title }}
      </div>
    </h2>
    <mat-dialog-content>
      <p class="text-lg">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="data.negativeAction" (click)="data.negativeAction()" class="text-gray-500">
        {{ data.negativeText || i18n.translate('CANCEL') }}
      </button>
      <button mat-button color="primary" (click)="data.positiveAction ? data.positiveAction() : dialogRef.close()">
        {{ data.positiveText || i18n.translate('OK') }}
      </button>
    </mat-dialog-actions>
  `
})
export class MobileCommonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MobileCommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public i18n: AppLocalizations
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class MobileDialogService {
  constructor(private dialog: MatDialog, private i18n: AppLocalizations) {}

  successDialog(message: string, title?: string) {
    this.dialog.open(MobileCommonDialogComponent, {
      data: {
        message,
        title: title || this.i18n.translate('success'),
        icon: '<div class="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white">✓</div>'
      }
    });
  }

  errorDialog(message: string, title?: string) {
    this.dialog.open(MobileCommonDialogComponent, {
      data: {
        message,
        title: title || this.i18n.translate('error'),
        icon: '<div class="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-white">✕</div>'
      }
    });
  }

  confirmDialog(params: { message: string, title?: string, positiveAction: () => void, negativeAction?: () => void }) {
    this.dialog.open(MobileCommonDialogComponent, {
      data: {
        message: params.message,
        title: params.title || this.i18n.translate('are_you_sure'),
        icon: '<div class="bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-white">?</div>',
        positiveAction: params.positiveAction,
        negativeAction: params.negativeAction || (() => this.dialog.closeAll())
      }
    });
  }

  infoDialog(message: string, title?: string) {
    this.dialog.open(MobileCommonDialogComponent, {
      data: {
        message,
        title: title || this.i18n.translate('information'),
        icon: '<div class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white">i</div>'
      }
    });
  }
}
