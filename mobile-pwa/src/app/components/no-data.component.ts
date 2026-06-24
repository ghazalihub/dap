import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center h-full">
      <mat-icon class="text-gray-300 text-6xl mb-4 h-16 w-16">sentiment_dissatisfied</mat-icon>
      <h3 class="text-xl font-bold text-gray-400 mb-2">{{ title }}</h3>
      <p class="text-gray-400">{{ message }}</p>
    </div>
  `
})
export class NoDataComponent {
  @Input() title: string = 'No Data';
  @Input() message: string = 'Nothing to show here.';
}
