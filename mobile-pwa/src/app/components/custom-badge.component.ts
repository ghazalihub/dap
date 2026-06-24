import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-badge',
  template: `
    <div [style.backgroundColor]="bgColor"
         [style.color]="textColor"
         class="px-2 py-0.5 rounded text-xs font-bold uppercase inline-block">
      {{ label }}
    </div>
  `
})
export class CustomBadgeComponent {
  @Input() label: string = '';
  @Input() bgColor: string = '#E91E63';
  @Input() textColor: string = 'white';
}
