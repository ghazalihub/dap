import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-profile-basic-info-card',
  template: `
    <div class="p-2">
      <mat-card class="bg-primary text-white p-3 rounded-xl shadow-md">
        <div class="flex items-center mb-3">
          <!-- Profile image -->
          <div class="p-1 bg-white rounded-full flex-shrink-0">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
              <img [src]="userService.currentUser?.userProfilePhoto" class="w-full h-full object-cover">
            </div>
          </div>

          <div class="ml-3 flex-grow">
            <h2 class="text-xl font-bold">
              {{ userService.currentUser?.userFullname?.split(' ')[0] }}, {{ userAge }}
            </h2>

            <div class="flex items-center mt-1">
              <mat-icon class="text-white text-sm mr-1">location_on</mat-icon>
              <div class="flex flex-col">
                <span class="text-sm leading-tight">{{ userService.currentUser?.userLocality }},</span>
                <span class="text-sm leading-tight">{{ userService.currentUser?.userCountry }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-around items-center pt-2">
          <button mat-stroked-button class="rounded-full text-white border-white h-8 text-sm" (click)="viewProfile()">
            <mat-icon class="text-white text-sm">visibility</mat-icon>
            {{ i18n.translate('view') }}
          </button>

          <button mat-fab class="bg-accent text-white w-10 h-10" (click)="goToSettings()">
            <mat-icon class="text-white">settings</mat-icon>
          </button>

          <button mat-flat-button class="rounded-full bg-white text-primary h-8 text-sm" (click)="editProfile()">
            <mat-icon class="text-primary text-sm">edit</mat-icon>
            {{ i18n.translate('edit') }}
          </button>
        </div>
      </mat-card>
    </div>
  `
})
export class ProfileBasicInfoCardComponent implements OnInit {
  userAge: number = 0;

  constructor(
    public userService: UserService,
    public i18n: AppLocalizations,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.userService.currentUser;
    if (user) {
      const birthDate = new Date(user.userBirthYear, user.userBirthMonth - 1, user.userBirthDay);
      this.userAge = this.userService.calculateUserAge(birthDate);
    }
  }

  viewProfile() {
    const user = this.userService.currentUser;
    if (user) {
      this.router.navigate(['/profile', user.userId], { state: { user, showButtons: false } });
    }
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
