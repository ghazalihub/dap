import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-circle-button',
  template: `
    <button mat-icon-button
            [style.backgroundColor]="bgColor"
            [style.color]="iconColor"
            (click)="clicked.emit()"
            class="flex items-center justify-center shadow-md">
      <mat-icon [style.fontSize.px]="size">{{ icon }}</mat-icon>
    </button>
  `,
  styles: [`
    button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }
  `]
})
export class CircleButtonComponent {
  @Input() icon: string = '';
  @Input() bgColor: string = 'white';
  @Input() iconColor: string = 'gray';
  @Input() size: number = 24;
  @Output() clicked = new EventEmitter<void>();
}
