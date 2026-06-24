import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  template: `
    <h2 mat-dialog-title>
      <div class="flex items-center">
        <span class="mr-2" [innerHTML]="data.icon"></span>
        {{ data.title }}
      </div>
    </h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="data.negativeAction" (click)="data.negativeAction()">
        {{ data.negativeText || 'CANCEL' }}
      </button>
      <button mat-button color="primary" (click)="data.positiveAction ? data.positiveAction() : dialogRef.close()">
        {{ data.positiveText || 'OK' }}
      </button>
    </mat-dialog-actions>
  `
})
export class CommonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  successDialog(message: string, title: string = 'Success') {
    this.dialog.open(CommonDialogComponent, {
      data: { message, title, icon: '<span class="text-green-500">✓</span>' }
    });
  }

  errorDialog(message: string, title: string = 'Error') {
    this.dialog.open(CommonDialogComponent, {
      data: { message, title, icon: '<span class="text-red-500">✕</span>' }
    });
  }

  confirmDialog(params: { message: string, title?: string, positiveAction: () => void, negativeAction?: () => void }) {
    this.dialog.open(CommonDialogComponent, {
      data: {
        message: params.message,
        title: params.title || 'Are you sure?',
        icon: '<span class="text-yellow-500">?</span>',
        positiveAction: params.positiveAction,
        negativeAction: params.negativeAction || (() => this.dialog.closeAll())
      }
    });
  }
}
