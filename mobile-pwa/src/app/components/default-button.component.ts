import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-default-button',
  template: `
    <button mat-flat-button color="primary"
            [disabled]="disabled"
            (click)="clicked.emit()"
            class="w-full py-4 rounded-full text-lg font-semibold uppercase tracking-wider">
      {{ label }}
    </button>
  `,
  styles: [`
    button { min-height: 48px; }
  `]
})
export class DefaultButtonComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<void>();
}
