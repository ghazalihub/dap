import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/core/app.service';
import { AppInfo } from '../models/app-info.model';

@Component({
  selector: 'app-admin-settings',
  template: `
    <div class="h-screen flex flex-col bg-gray-50 overflow-y-auto">
      <header class="bg-white p-4 border-b flex items-center shadow-sm">
         <h1 class="text-xl font-bold">App Settings</h1>
      </header>

      <div class="p-8 max-w-6xl mx-auto w-full space-y-10">
        <!-- Version Control -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <app-app-version-control
             title="Android App Version Control"
             subtitle="Google Play - App Current Version Number"
             [appVersion]="androidVersion"
             (increment)="androidVersion = androidVersion + 1"
             (decrement)="androidVersion = androidVersion > 1 ? androidVersion - 1 : 1">
           </app-app-version-control>

           <app-app-version-control
             title="iOS App Version Control"
             subtitle="App Store - Current Version Number"
             [appVersion]="iosVersion"
             (increment)="iosVersion = iosVersion + 1"
             (decrement)="iosVersion = iosVersion > 1 ? iosVersion - 1 : 1">
           </app-app-version-control>
        </div>

        <!-- Package and ID -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Android Package name</mat-label>
            <mat-icon matPrefix>android</mat-icon>
            <input matInput [(ngModel)]="androidPackageName" placeholder="com.example.package">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>iOS App ID</mat-label>
            <mat-icon matPrefix>phone_iphone</mat-icon>
            <input matInput [(ngModel)]="iosAppId" placeholder="0123456789">
          </mat-form-field>
        </div>

        <!-- Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Privacy Policy Url</mat-label>
            <mat-icon matPrefix>link</mat-icon>
            <input matInput [(ngModel)]="privacyUrl" placeholder="https://your.website.com/privacy">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Terms of Service Url</mat-label>
            <mat-icon matPrefix>link</mat-icon>
            <input matInput [(ngModel)]="termsUrl" placeholder="https://your.website.com/terms">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>App Email Address for Support</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput [(ngModel)]="appEmail" placeholder="your.email@admin.com">
        </mat-form-field>

        <mat-divider></mat-divider>

        <!-- Distance Settings -->
        <section>
          <h3 class="text-gray-500 font-bold mb-4 uppercase tracking-widest text-sm">Distance Radius Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Free Account Max Distance Radius</mat-label>
              <mat-icon matPrefix>location_on</mat-icon>
              <input matInput type="number" [(ngModel)]="freeDistance" placeholder="160">
              <span matSuffix class="pr-2 font-bold text-gray-400">KM</span>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>VIP Account Max Distance Radius</mat-label>
              <mat-icon matPrefix>location_on</mat-icon>
              <input matInput type="number" [(ngModel)]="vipDistance" placeholder="500">
              <span matSuffix class="pr-2 font-bold text-gray-400">KM</span>
            </mat-form-field>
          </div>
        </section>

        <!-- Save Button -->
        <div class="flex justify-center pt-4">
           <button mat-flat-button color="primary" class="px-12 py-6 text-lg font-bold rounded-full shadow-lg" (click)="saveSettings()">
             SAVE CHANGES
           </button>
        </div>
      </div>

      <div class="h-20"></div>
    </div>
  `
})
export class AdminSettingsPageComponent implements OnInit {
  androidVersion = 1;
  iosVersion = 1;
  androidPackageName = '';
  iosAppId = '';
  privacyUrl = '';
  termsUrl = '';
  appEmail = '';
  freeDistance = 100;
  vipDistance = 200;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.appInfo$.subscribe(info => {
      if (info) {
        this.androidVersion = info.androidAppCurrentVersion;
        this.iosVersion = info.iosAppCurrentVersion;
        this.androidPackageName = info.androidPackageName;
        this.iosAppId = info.iOsAppId;
        this.privacyUrl = info.privacyPolicyUrl;
        this.termsUrl = info.termsOfServicesUrl;
        this.appEmail = info.appEmail;
        this.freeDistance = info.freeAccountMaxDistance;
        this.vipDistance = info.vipAccountMaxDistance;
      }
    });
  }

  saveSettings() {
    this.appService.saveAppSettings({
      androidAppCurrentVersion: this.androidVersion,
      iosAppCurrentVersion: this.iosVersion,
      androidPackageName: this.androidPackageName,
      iOsAppId: this.iosAppId,
      appEmail: this.appEmail,
      privacyPolicyUrl: this.privacyUrl,
      termsOfServicesUrl: this.termsUrl,
      freeAccountMaxDistance: this.freeDistance,
      vipAccountMaxDistance: this.vipDistance,
      onSuccess: () => alert('App Settings updated successfully!'),
      onError: () => alert('Error while updating App Settings.')
    });
  }
}
