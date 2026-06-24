import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-pie-chart',
  template: `
    <mat-card class="m-4 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h3 class="text-xl font-bold text-gray-700 mb-6 text-center">Chart Statistic</h3>

      <div class="relative h-[300px] flex items-center justify-center">
        <!-- In a real project, we'd use Chart.js or ngx-charts -->
        <!-- This is a visual/logic representation for the port -->
        <div class="w-64 h-64 rounded-full border-[30px] border-gray-100 flex items-center justify-center">
           <div class="text-center">
             <div class="text-4xl font-bold text-primary">{{ totalUsers }}</div>
             <div class="text-gray-500 uppercase text-xs tracking-widest">Total Users</div>
           </div>
        </div>

        <!-- Legend as placeholder for chart sections -->
        <div class="absolute right-0 top-0 flex flex-col space-y-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-xs">{{ getPercentage(totalActiveUsers) }} Active</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-xs">{{ getPercentage(totalVerifiedUsers) }} Verified</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-xs">{{ getPercentage(totalFlaggedUsers) }} Flagged</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span class="text-xs">{{ getPercentage(totalBlockedUsers) }} Blocked</span>
          </div>
        </div>
      </div>
    </mat-card>
  `
})
export class UsersPieChartComponent {
  @Input() totalUsers: number = 0;
  @Input() totalActiveUsers: number = 0;
  @Input() totalVerifiedUsers: number = 0;
  @Input() totalFlaggedUsers: number = 0;
  @Input() totalBlockedUsers: number = 0;

  getPercentage(value: number): string {
    if (this.totalUsers === 0) return '0%';
    return ((value / this.totalUsers) * 100).toFixed(1) + '%';
  }
}
