import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_NAME } from '../constants/constants';

@Component({
  selector: 'app-admin-navigation-drawer',
  template: `
    <div class="h-full flex flex-col bg-white border-r border-gray-200 w-64 shadow-xl">
      <!-- Drawer Header -->
      <div class="bg-primary p-10 flex flex-col items-center">
        <app-admin-logo [width]="80" [height]="80" class="mb-4"></app-admin-logo>
        <h2 class="text-white text-lg font-bold text-center leading-tight">{{ APP_NAME }}</h2>
      </div>

      <mat-divider></mat-divider>

      <!-- Navigation List -->
      <mat-nav-list class="flex-grow pt-2">
        <mat-list-item (click)="navigate('/dashboard')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>score</mat-icon>
          <span matListItemTitle class="font-medium">Dashboard</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/users')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>people_outline</mat-icon>
          <span matListItemTitle class="font-medium">Users</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/flagged-users')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>flag_outlined</mat-icon>
          <span matListItemTitle class="font-medium">Flagged Users</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/app-settings')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>settings_outlined</mat-icon>
          <span matListItemTitle class="font-medium">App Settings</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/in-app-purchases')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>monetization_on</mat-icon>
          <span matListItemTitle class="font-medium">In-App Purchases</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/push-notifications')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>notifications_outlined</mat-icon>
          <span matListItemTitle class="font-medium">Push Notifications</span>
        </mat-list-item>

        <mat-list-item (click)="navigate('/admin-profile')" class="hover:bg-gray-100">
          <mat-icon matListItemIcon>person_outline</mat-icon>
          <span matListItemTitle class="font-medium">Admin Profile</span>
        </mat-list-item>

        <mat-divider class="my-2"></mat-divider>

        <mat-list-item (click)="logout()" class="hover:bg-red-50 text-red-600">
          <mat-icon matListItemIcon class="text-red-600">logout</mat-icon>
          <span matListItemTitle class="font-bold">Log out</span>
        </mat-list-item>
      </mat-nav-list>
    </div>
  `
})
export class AdminNavigationDrawerComponent {
  APP_NAME = APP_NAME;

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.router.navigate(['/sign-in']);
  }
}
