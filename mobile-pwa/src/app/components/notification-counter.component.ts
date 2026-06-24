import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-counter',
  template: `
    <div *ngIf="count > 0"
         class="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
      {{ count > 99 ? '9+' : count }}
    </div>
  `
})
export class NotificationCounterComponent {
  @Input() count: number = 0;
}
