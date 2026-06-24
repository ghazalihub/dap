import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  template: `
    <mat-card class="m-4 w-[250px] shadow-lg hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-100">
      <div class="p-5 flex items-center">
        <div [style.backgroundColor]="iconBgColor" class="w-20 h-20 rounded-full flex items-center justify-center mr-4">
          <mat-icon class="text-white text-4xl h-10 w-10">{{ icon }}</mat-icon>
        </div>
        <div class="flex flex-col">
          <span class="text-3xl font-bold text-gray-800">{{ total }}</span>
          <span class="text-gray-500 text-sm font-medium">{{ description }}</span>
        </div>
      </div>
    </mat-card>
  `
})
export class StatisticCardComponent {
  @Input() icon: string = '';
  @Input() iconBgColor: string = '#E91E63';
  @Input() total: number = 0;
  @Input() description: string = '';
}
