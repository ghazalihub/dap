import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/core/app.service';
import { APP_NAME } from '../constants/constants';

@Component({
  selector: 'app-admin-sign-in',
  template: `
    <div class="h-screen w-screen bg-primary flex items-center justify-center p-4">
      <mat-card class="max-w-md w-full p-8 shadow-2xl rounded-2xl bg-white">
        <div class="flex flex-col items-center mb-8">
           <app-admin-logo [width]="100" [height]="100" class="mb-4"></app-admin-logo>
           <h1 class="text-2xl font-bold text-gray-800 text-center">{{ APP_NAME }}</h1>
           <p class="text-gray-500 mt-2 text-center">Sign in with your username and password</p>
        </div>

        <form class="space-y-6" (submit)="signIn()">
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
            SIGN IN
          </button>
        </form>
      </mat-card>
    </div>
  `
})
export class AdminSignInPageComponent {
  APP_NAME = APP_NAME;
  username = '';
  password = '';
  hidePass = true;

  constructor(private appService: AppService, private router: Router) {}

  async signIn() {
    if (!this.username || !this.password) return;

    await this.appService.adminSignIn({
      username: this.username,
      password: this.password,
      onSuccess: () => this.router.navigate(['/dashboard']),
      onError: () => {
         alert('Username or Password is invalid.\nPlease try again!');
      }
    });
  }
}
