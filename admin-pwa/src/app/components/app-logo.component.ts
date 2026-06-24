import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-logo',
  template: `
    <div class="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <img src="assets/images/app_logo.png" [style.width.px]="width" [style.height.px]="height" class="object-contain">
    </div>
  `
})
export class AdminLogoComponent {
  @Input() width: number = 200;
  @Input() height: number = 200;
}
