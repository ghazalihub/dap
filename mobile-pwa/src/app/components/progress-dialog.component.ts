import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-progress-dialog',
  template: `
    <div class="p-4 flex items-center">
      <mat-spinner diameter="40" class="mr-4"></mat-spinner>
      <span class="text-lg font-semibold text-black">{{ data.message }}</span>
    </div>
  `
})
export class ProgressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
