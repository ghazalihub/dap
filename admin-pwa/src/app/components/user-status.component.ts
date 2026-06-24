import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-status',
  template: `
    <div [style.backgroundColor]="bgColor"
         class="px-3 py-1 rounded-full text-white text-xs font-bold text-center inline-block min-w-[80px]">
      {{ status }}
    </div>
  `
})
export class UserStatusComponent implements OnInit {
  @Input() status: string = '';
  bgColor: string = '#E91E63';

  ngOnInit() {
    switch (this.status) {
      case 'active':
        this.bgColor = '#4CAF50'; // green
        break;
      case 'verified':
        this.bgColor = '#2196F3'; // blue
        break;
      case 'Not verified':
        this.bgColor = '#000000'; // black
        break;
      case 'flagged':
        this.bgColor = '#FFC107'; // amber
        break;
      case 'blocked':
        this.bgColor = '#F44336'; // red
        break;
    }
  }
}
