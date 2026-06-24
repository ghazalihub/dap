import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-circular-progress',
  template: `
    <div class="flex items-center justify-center p-6">
      <mat-spinner [diameter]="size" color="primary"></mat-spinner>
    </div>
  `
})
export class AdminCircularProgressComponent {
  @Input() size: number = 50;
}
