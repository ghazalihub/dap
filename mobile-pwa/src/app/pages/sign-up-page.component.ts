import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { AppService } from '../services/core/app.service';

@Component({
  selector: 'app-sign-up',
  template: `
    <div class="h-full flex flex-col bg-white">
      <header class="flex items-center p-4 border-b">
        <h1 class="text-lg font-medium">{{ i18n.translate('sign_up') }}</h1>
        <span class="flex-grow"></span>
        <button mat-button color="primary" (click)="signOut()">{{ i18n.translate('sign_out') }}</button>
      </header>

      <div *ngIf="userService.isLoading" class="flex-grow flex items-center justify-center">
        <app-processing [text]="i18n.translate('processing')"></app-processing>
      </div>

      <div *ngIf="!userService.isLoading" class="flex-grow overflow-y-auto p-6">
        <h2 class="text-2xl font-bold text-center mb-8">{{ i18n.translate('create_account') }}</h2>

        <!-- Profile photo -->
        <div class="flex flex-col items-center mb-8">
           <div class="w-32 h-32 rounded-full bg-primary flex items-center justify-center overflow-hidden cursor-pointer" (click)="selectImage()">
              <img *ngIf="imageFile" [src]="imagePreview" class="w-full h-full object-cover">
              <mat-icon *ngIf="!imageFile" class="text-white text-5xl">camera_alt</mat-icon>
           </div>
           <p class="mt-2 text-sm text-gray-500">{{ i18n.translate('profile_photo') }}</p>
        </div>

        <form class="space-y-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('fullname') }}</mat-label>
            <mat-icon matPrefix class="mr-2">person</mat-icon>
            <input matInput [(ngModel)]="fullName" name="fullname" [placeholder]="i18n.translate('enter_your_fullname')">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('select_gender') }}</mat-label>
            <mat-select [(ngModel)]="selectedGender" name="gender">
              <mat-option value="Male">Male</mat-option>
              <mat-option value="Female">Female</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="border border-gray-300 rounded-full px-4 py-3 flex items-center cursor-pointer mb-6" (click)="birthdayPicker.click()">
             <mat-icon class="text-gray-500 mr-3">calendar_today</mat-icon>
             <span class="text-gray-600 flex-grow">{{ birthday || i18n.translate('select_your_birthday') }}</span>
             <mat-icon class="text-gray-400">arrow_drop_down</mat-icon>
             <input type="date" #birthdayPicker class="hidden" (change)="onBirthdayChange($event)">
          </div>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('school') }}</mat-label>
            <mat-icon matPrefix class="mr-2">school</mat-icon>
            <input matInput [(ngModel)]="school" name="school" [placeholder]="i18n.translate('enter_your_school_name')">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('job_title') }}</mat-label>
            <mat-icon matPrefix class="mr-2">work</mat-icon>
            <input matInput [(ngModel)]="jobTitle" name="job" [placeholder]="i18n.translate('enter_your_job_title')">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('bio') }}</mat-label>
            <mat-icon matPrefix class="mr-2">info</mat-icon>
            <textarea matInput [(ngModel)]="bio" name="bio" rows="4" [placeholder]="i18n.translate('please_write_your_bio')"></textarea>
          </mat-form-field>

          <div class="flex items-center">
            <mat-checkbox [(ngModel)]="agreeTerms" name="agree"></mat-checkbox>
            <span class="ml-2 text-sm">{{ i18n.translate('i_agree_with') }} <a class="underline">Terms & Privacy</a></span>
          </div>

          <app-default-button
            [label]="i18n.translate('CREATE_ACCOUNT')"
            (clicked)="createAccount()">
          </app-default-button>
        </form>
      </div>
    </div>
  `
})
export class SignUpPageComponent implements OnInit {
  fullName = '';
  selectedGender = '';
  birthday = '';
  birthDate?: Date;
  school = '';
  jobTitle = '';
  bio = '';
  agreeTerms = false;
  imageFile?: File;
  imagePreview?: string;

  constructor(
    public userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private mobileDialogService: MobileDialogService,
    private appService: AppService
  ) {}

  ngOnInit() {}

  selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      this.imageFile = e.target.files[0];
      if (this.imageFile) {
        const reader = new FileReader();
        reader.onload = (event: any) => this.imagePreview = event.target.result;
        reader.readAsDataURL(this.imageFile);
      }
    };
    input.click();
  }

  onBirthdayChange(event: any) {
    this.birthday = event.target.value;
    this.birthDate = new Date(this.birthday);
  }

  signOut() {
    this.router.navigate(['/sign-in']);
  }

  async createAccount() {
    if (!this.imageFile) {
       this.mobileDialogService.errorDialog(this.i18n.translate('please_select_your_profile_photo'));
       return;
    }
    if (!this.agreeTerms) {
       this.mobileDialogService.errorDialog(this.i18n.translate('you_must_agree_to_our_privacy_policy'));
       return;
    }
    if (!this.birthDate || this.userService.calculateUserAge(this.birthDate) < 18) {
       this.mobileDialogService.errorDialog(this.i18n.translate('only_18_years_old_and_above_are_allowed_to_create_an_account'));
       return;
    }

    await this.userService.signUp({
      userPhotoFile: this.imageFile,
      userFullName: this.fullName,
      userGender: this.selectedGender,
      userBirthDay: this.birthDate.getDate(),
      userBirthMonth: this.birthDate.getMonth() + 1,
      userBirthYear: this.birthDate.getFullYear(),
      userSchool: this.school,
      userJobTitle: this.jobTitle,
      userBio: this.bio,
      freeAccountMaxDistance: this.appService.currentUserAppInfo?.freeAccountMaxDistance || 100,
      onSuccess: () => {
        this.mobileDialogService.successDialog(
          this.i18n.translate('your_account_has_been_created_successfully')
        );
        this.router.navigate(['/update-location']);
      },
      onFail: (err) => {
        this.mobileDialogService.errorDialog(err.message || 'Error creating account');
      }
    });
  }
}
