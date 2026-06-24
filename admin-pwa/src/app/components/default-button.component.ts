import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-button',
  template: `
    <button mat-flat-button color="primary"
            [disabled]="disabled"
            (click)="clicked.emit()"
            class="px-8 py-3 rounded text-lg font-bold shadow-md hover:shadow-lg transition-shadow">
      {{ label }}
    </button>
  `
})
export class AdminButtonComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();
}
