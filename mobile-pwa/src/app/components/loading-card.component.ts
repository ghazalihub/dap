import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  template: `
    <div class="p-2 animate-pulse">
      <div class="bg-gray-200 rounded-xl h-60 w-full mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  `
})
export class LoadingCardComponent {}
