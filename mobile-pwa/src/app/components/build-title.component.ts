import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-build-title',
  template: `
    <div class="flex items-center p-4 border-b bg-white">
      <mat-icon *ngIf="svgIconName" class="text-primary mr-3 h-8 w-8 text-3xl">{{ svgIconName }}</mat-icon>
      <h2 class="text-lg font-bold text-primary">{{ title }}</h2>
    </div>
  `
})
export class BuildTitleComponent {
  @Input() svgIconName?: string;
  @Input() title: string = '';
}
