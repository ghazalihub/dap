import { Component } from '@angular/core';
import { UserService } from '../services/core/user.service';

@Component({
  selector: 'app-profile-tab',
  template: `
    <div class="h-full overflow-y-auto p-2 bg-gray-50">
      <!-- Basic profile info -->
      <app-profile-basic-info-card></app-profile-basic-info-card>

      <div class="h-2"></div>

      <!-- Profile Statistics Card -->
      <app-profile-statistics-card></app-profile-statistics-card>

      <div class="h-2"></div>

      <!-- Show VIP card -->
      <app-vip-account-card></app-vip-account-card>

      <div class="h-2"></div>

      <!-- App Section Card (Ported logic) -->
      <mat-card class="rounded-xl shadow-md p-0 overflow-hidden">
        <mat-list>
          <mat-list-item class="hover:bg-gray-100">
            <mat-icon matListItemIcon class="text-primary">info</mat-icon>
            <div matListItemTitle>About Us</div>
            <mat-icon matListItemMeta>chevron_right</mat-icon>
          </mat-list-item>
          <mat-divider></mat-divider>
          <mat-list-item class="hover:bg-gray-100">
            <mat-icon matListItemIcon class="text-primary">share</mat-icon>
            <div matListItemTitle>Share App</div>
            <mat-icon matListItemMeta>chevron_right</mat-icon>
          </mat-list-item>
        </mat-list>
      </mat-card>

      <div class="h-4"></div>

      <!-- Sign out button -->
      <button mat-flat-button class="w-full bg-white text-primary font-bold py-4 rounded-xl shadow-sm border border-gray-100" (click)="signOut()">
        SIGN OUT
      </button>

      <div class="h-4"></div>

      <!-- Delete Account -->
      <button mat-button class="w-full text-gray-400 text-sm py-4" (click)="deleteAccount()">
        DELETE ACCOUNT
      </button>

      <div class="h-8"></div>
    </div>
  `
})
export class ProfileTabComponent {
  constructor(private userService: UserService) {}

  signOut() {
    // Logic to sign out
  }

  deleteAccount() {
    // Logic to delete account
  }
}
