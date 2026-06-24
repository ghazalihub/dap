import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  template: `
    <mat-icon [svgIcon]="iconName" [style.width.px]="size" [style.height.px]="size" [style.color]="color"></mat-icon>
  `
})
export class SvgIconComponent {
  @Input() iconName: string = '';
  @Input() size: number = 24;
  @Input() color: string = 'currentColor';
}
