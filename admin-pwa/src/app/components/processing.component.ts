import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-processing',
  template: `
    <div class="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-lg border border-gray-100">
      <mat-spinner diameter="60" color="primary" class="mb-6"></mat-spinner>
      <p class="text-xl font-bold text-gray-800">{{ text }}</p>
    </div>
  `
})
export class AdminProcessingComponent {
  @Input() text: string = 'Processing Data...';
}
