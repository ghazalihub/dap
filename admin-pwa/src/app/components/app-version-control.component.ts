import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-app-version-control',
  template: `
    <mat-card class="m-0 h-[63px] border border-gray-300 rounded shadow-sm overflow-hidden flex items-center px-4">
      <div class="flex items-center space-x-2 mr-6">
        <button mat-icon-button (click)="decrement.emit()" class="text-primary w-8 h-8">
          <mat-icon>remove</mat-icon>
        </button>
        <span class="text-xl font-bold text-gray-500 w-8 text-center">{{ appVersion }}</span>
        <button mat-icon-button (click)="increment.emit()" class="text-primary w-8 h-8">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-gray-800">{{ title }}</span>
        <span class="text-xs text-gray-500">{{ subtitle }}</span>
      </div>
    </mat-card>
  `
})
export class AppVersionControlComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() appVersion: number = 0;

  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
}
