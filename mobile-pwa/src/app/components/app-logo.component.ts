import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <div class="flex flex-col items-center justify-center p-4">
      <img [src]="src" [style.width.px]="width" [style.height.px]="height" class="object-contain">
    </div>
  `
})
export class AppLogoComponent {
  @Input() width: number = 180;
  @Input() height: number = 180;
  @Input() src: string = 'assets/images/app_logo.png';
}
