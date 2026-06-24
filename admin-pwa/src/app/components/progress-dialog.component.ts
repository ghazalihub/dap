import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-progress-dialog',
  template: `
    <div class="p-6 flex items-center bg-white rounded-lg shadow-xl">
      <mat-spinner diameter="45" class="mr-6"></mat-spinner>
      <span class="text-xl font-bold text-gray-800">{{ data.message }}</span>
    </div>
  `
})
export class AdminProgressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AdminProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
