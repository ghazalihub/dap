import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-processing',
  template: `
    <div class="flex flex-col items-center justify-center p-6 text-center">
      <mat-spinner diameter="50" color="primary" class="mb-4"></mat-spinner>
      <p class="text-lg font-medium text-gray-700">{{ text }}</p>
    </div>
  `
})
export class ProcessingComponent {
  @Input() text: string = 'Processing...';
}
