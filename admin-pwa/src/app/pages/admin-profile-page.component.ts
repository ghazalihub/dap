import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/core/app.service';

@Component({
  selector: 'app-admin-profile-screen',
  template: `
    <div class="h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
      <mat-card class="max-w-md w-full p-8 shadow-2xl rounded-2xl bg-white border border-gray-100">
        <div class="text-center mb-8">
           <mat-icon class="text-primary text-6xl h-20 w-20 mb-4">account_circle</mat-icon>
           <h1 class="text-2xl font-bold text-gray-800">Admin Account</h1>
           <p class="text-gray-500 mt-2">Profile information</p>
        </div>

        <form class="space-y-6" (submit)="updateProfile()">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Username</mat-label>
            <mat-icon matPrefix>person_outline</mat-icon>
            <input matInput [(ngModel)]="username" name="username" placeholder="Enter your username" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock_outline</mat-icon>
            <input matInput [type]="hidePass ? 'password' : 'text'" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
            <button mat-icon-button matSuffix (click)="hidePass = !hidePass" type="button">
              <mat-icon>{{ hidePass ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-flat-button color="primary" class="w-full py-6 text-lg font-bold rounded-full shadow-lg" type="submit">
            UPDATE
          </button>
        </form>
      </mat-card>
    </div>
  `
})
export class AdminProfilePageComponent implements OnInit {
  username = '';
  password = '';
  hidePass = true;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.appInfo$.subscribe(info => {
      if (info) {
         // Using any mapping for port
         this.username = (info as any).adminUsername || '';
         this.password = (info as any).adminPassword || '';
      }
    });
  }

  async updateProfile() {
    this.appService.updateAdminSignInInfo({
      adminUsername: this.username,
      adminPassword: this.password,
      onSuccess: () => alert('Admin sign in info updated successfully!'),
      onError: () => alert('Error while updating Admin sign in info.')
    });
  }
}
