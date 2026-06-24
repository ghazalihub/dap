import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../services/core/app.service';
import { APP_NAME, USER_STATUS, USER_IS_VERIFIED } from '../constants/constants';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden">
      <!-- Sidebar -->
      <app-admin-navigation-drawer></app-admin-navigation-drawer>

      <!-- Main Content -->
      <div class="flex-grow flex flex-col overflow-y-auto">
        <!-- App Bar -->
        <header class="bg-white p-4 shadow-sm flex items-center justify-between border-b">
           <h1 class="text-xl font-bold text-primary">{{ APP_NAME }}</h1>
        </header>

        <div *ngIf="isLoading" class="flex-grow flex items-center justify-center">
           <app-admin-processing></app-admin-processing>
        </div>

        <div *ngIf="!isLoading" class="p-6 space-y-8">
           <!-- Dashboard Header -->
           <div class="bg-white p-8 rounded-xl shadow-sm text-center">
              <mat-icon class="text-gray-300 text-6xl h-20 w-20 mb-4">score</mat-icon>
              <h2 class="text-3xl font-bold text-gray-800">Control Panel</h2>
              <p class="text-gray-500 text-lg">Watch your business growing in real time!</p>
           </div>

           <!-- Statistics Row -->
           <div class="flex flex-wrap justify-center -m-2">
              <app-statistic-card
                icon="person_add"
                iconBgColor="#4CAF50"
                [total]="stats.active"
                description="Total Active Users">
              </app-statistic-card>

              <app-statistic-card
                icon="check"
                iconBgColor="#2196F3"
                [total]="stats.verified"
                description="Total Verified Users">
              </app-statistic-card>

              <app-statistic-card
                icon="flag"
                iconBgColor="#FFC107"
                [total]="stats.flagged"
                description="Total Flagged Users">
              </app-statistic-card>

              <app-statistic-card
                icon="lock"
                iconBgColor="#F44336"
                [total]="stats.blocked"
                description="Total Blocked Users">
              </app-statistic-card>
           </div>

           <!-- Chart Section -->
           <div class="flex justify-center">
              <app-users-pie-chart
                 [totalUsers]="totalUsers"
                 [totalActiveUsers]="stats.active"
                 [totalVerifiedUsers]="stats.verified"
                 [totalFlaggedUsers]="stats.flagged"
                 [totalBlockedUsers]="stats.blocked">
              </app-users-pie-chart>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardPageComponent implements OnInit, OnDestroy {
  APP_NAME = APP_NAME;
  isLoading = true;
  totalUsers = 0;
  stats = { active: 0, verified: 0, flagged: 0, blocked: 0 };

  private subs = new Subscription();

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.subs.add(
      this.appService.getUsersStream().subscribe(snapshot => {
        const users = snapshot.docs;
        this.totalUsers = users.length;

        this.stats = {
          active: users.filter(u => u.get(USER_STATUS) === 'active').length,
          verified: users.filter(u => u.get(USER_IS_VERIFIED) === true).length,
          flagged: users.filter(u => u.get(USER_STATUS) === 'flagged').length,
          blocked: users.filter(u => u.get(USER_STATUS) === 'blocked').length
        };

        this.isLoading = false;
        this.appService.updateUsers(users);
      })
    );

    this.subs.add(
      this.appService.getAppInfoStream().subscribe(snapshot => {
        if (snapshot.exists()) {
           this.appService.updateAppObject(snapshot.data());
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
