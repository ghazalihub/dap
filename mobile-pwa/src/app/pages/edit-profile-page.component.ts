import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ProgressDialogComponent } from '../components/progress-dialog.component';

@Component({
  selector: 'app-edit-profile',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <!-- App Bar -->
      <header class="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
        <div class="flex items-center">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-lg font-bold ml-2">{{ i18n.translate('edit_profile') }}</h1>
        </div>
        <button mat-button color="primary" (click)="saveChanges()">{{ i18n.translate('SAVE') }}</button>
      </header>

      <div class="p-4 space-y-8">
        <!-- Profile Photo -->
        <div class="flex flex-col items-center">
           <div class="relative w-40 h-40" (click)="selectProfileImage()">
              <img [src]="userService.currentUser?.userProfilePhoto" class="w-full h-full rounded-full object-cover border-4 border-primary">
              <div class="absolute bottom-0 right-0 bg-primary rounded-full p-2 border-4 border-white shadow-lg">
                <mat-icon class="text-white">edit</mat-icon>
              </div>
           </div>
           <p class="mt-4 text-gray-500 font-medium">{{ i18n.translate('profile_photo') }}</p>
        </div>

        <!-- Gallery -->
        <section>
          <h3 class="text-gray-400 text-lg mb-4">{{ i18n.translate('gallery') }}</h3>
          <app-user-gallery></app-user-gallery>
        </section>

        <!-- Form Fields -->
        <div class="space-y-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('bio') }}</mat-label>
            <mat-icon matPrefix class="mr-2">info</mat-icon>
            <textarea matInput [(ngModel)]="bio" rows="4" [placeholder]="i18n.translate('write_about_you')"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('school') }}</mat-label>
            <mat-icon matPrefix class="mr-2">school</mat-icon>
            <input matInput [(ngModel)]="school" [placeholder]="i18n.translate('enter_your_school_name')">
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ i18n.translate('job_title') }}</mat-label>
            <mat-icon matPrefix class="mr-2">work</mat-icon>
            <input matInput [(ngModel)]="jobTitle" [placeholder]="i18n.translate('enter_your_job_title')">
          </mat-form-field>
        </div>
      </div>

      <div class="h-20"></div>
    </div>
  `
})
export class EditProfilePageComponent implements OnInit {
  bio: string = '';
  school: string = '';
  jobTitle: string = '';

  constructor(
    public userService: UserService,
    public i18n: AppLocalizations,
    private router: Router,
    private dialog: MatDialog,
    private mobileDialogService: MobileDialogService
  ) {}

  ngOnInit() {
    const user = this.userService.currentUser;
    if (user) {
      this.bio = user.userBio;
      this.school = user.userSchool;
      this.jobTitle = user.userJobTitle;
    }
  }

  goBack() {
    window.history.back();
  }

  selectProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const pr = this.dialog.open(ProgressDialogComponent, { data: { message: this.i18n.translate('processing') } });
        await this.userService.updateProfileImage({
          imageFile: file,
          oldImageUrl: this.userService.currentUser?.userProfilePhoto,
          path: 'profile'
        });
        pr.close();
      }
    };
    input.click();
  }

  async saveChanges() {
    const pr = this.dialog.open(ProgressDialogComponent, { data: { message: this.i18n.translate('processing') } });

    await this.userService.updateProfile({
      userSchool: this.school,
      userJobTitle: this.jobTitle,
      userBio: this.bio,
      onSuccess: () => {
        pr.close();
        this.mobileDialogService.successDialog(this.i18n.translate('profile_updated_successfully'));
        this.router.navigate(['/home']);
      },
      onFail: (err) => {
        pr.close();
        this.mobileDialogService.errorDialog(this.i18n.translate('an_error_occurred_while_updating_your_profile'));
      }
    });
  }
}
