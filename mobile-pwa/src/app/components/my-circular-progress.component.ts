import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-circular-progress',
  template: `
    <div class="flex items-center justify-center p-4">
      <mat-spinner [diameter]="size" color="primary"></mat-spinner>
    </div>
  `
})
export class MyCircularProgressComponent {
  @Input() size: number = 40;
}
