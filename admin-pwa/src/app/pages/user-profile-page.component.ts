import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../services/core/app.service';
import { DialogService } from '../services/core/dialog.service';
import { User } from '../models/user.model';
import { USER_STATUS } from '../constants/constants';

@Component({
  selector: 'app-admin-user-profile',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto" *ngIf="user">
      <header class="bg-white p-4 border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
         <div class="flex items-center">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="text-xl font-bold ml-2">User Profile</h1>
         </div>

         <button mat-icon-button [matMenuTriggerFor]="menu">
           <mat-icon>more_vert</mat-icon>
         </button>
         <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="copyToClipboard(user.userId, 'User ID')">
               <mat-icon>content_copy</mat-icon>
               <span>Copy User ID</span>
            </button>
            <button mat-menu-item (click)="copyToClipboard(user.userPhoneNumber, 'Phone Number')">
               <mat-icon>phone</mat-icon>
               <span>Copy Phone Number</span>
            </button>
            <button mat-menu-item (click)="toggleUserStatus()">
               <mat-icon>{{ user.userStatus === 'active' ? 'lock' : 'check_circle' }}</mat-icon>
               <span>{{ user.userStatus === 'active' ? 'Block User' : 'Activate User' }}</span>
            </button>
         </mat-menu>
      </header>

      <div class="bg-primary text-white p-10 flex flex-col items-center">
         <div class="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
            <img [src]="user.userProfilePhoto" class="w-full h-full object-cover">
         </div>
         <h2 class="text-3xl font-bold">{{ user.userFullname }}</h2>
         <div class="flex items-center mt-2 opacity-90">
            <mat-icon class="mr-1">location_on</mat-icon>
            <span class="text-xl">{{ user.userCountry }}, {{ user.userLocality }}</span>
         </div>

         <!-- Stats Card -->
         <mat-card class="mt-8 max-w-2xl w-full p-6 rounded-3xl shadow-lg bg-white text-gray-800">
            <div class="flex justify-around items-center">
               <div class="text-center">
                  <mat-icon class="text-gray-400 text-3xl">favorite_border</mat-icon>
                  <div class="text-xs uppercase font-bold text-gray-500 mt-1">LIKES</div>
                  <div class="text-2xl font-bold">{{ user.userTotalLikes }}</div>
               </div>
               <div class="text-center">
                  <mat-icon class="text-gray-400 text-3xl">visibility</mat-icon>
                  <div class="text-xs uppercase font-bold text-gray-500 mt-1">VISITS</div>
                  <div class="text-2xl font-bold">{{ user.userTotalVisits }}</div>
               </div>
               <div class="text-center">
                  <mat-icon class="text-gray-400 text-3xl">cancel</mat-icon>
                  <div class="text-xs uppercase font-bold text-gray-500 mt-1">DISLIKES</div>
                  <div class="text-2xl font-bold">{{ user.userTotalDisliked }}</div>
               </div>
            </div>
         </mat-card>
      </div>

      <div class="p-8 max-w-4xl mx-auto w-full space-y-10">
         <!-- Gallery Section -->
         <section>
            <h3 class="text-gray-500 text-lg font-bold mb-4 uppercase tracking-widest">Profile Gallery</h3>
            <div *ngIf="galleryImages.length === 0" class="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
               <mat-icon class="text-gray-300 text-6xl mb-2">photo_library</mat-icon>
               <p class="text-gray-400 italic">Gallery empty</p>
            </div>
            <div class="grid grid-cols-3 gap-4" *ngIf="galleryImages.length > 0">
               <div *ngFor="let img of galleryImages" class="aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100">
                  <img [src]="img" class="w-full h-full object-cover">
               </div>
            </div>
         </section>

         <mat-divider></mat-divider>

         <!-- Info Section -->
         <section>
            <h3 class="text-gray-500 text-lg font-bold mb-4 uppercase tracking-widest">Profile Information</h3>
            <div class="space-y-2">
               <app-info-tile icon="info_outline" label="Bio" [value]="user.userBio"></app-info-tile>
               <app-info-tile icon="person_outline" label="Full name" [value]="user.userFullname"></app-info-tile>
               <app-info-tile icon="wc" label="Gender" [value]="user.userGender"></app-info-tile>
               <app-info-tile icon="cake" label="Birthday" [value]="user.userBirthYear + '/' + user.userBirthMonth + '/' + user.userBirthDay"></app-info-tile>
               <app-info-tile icon="school" label="School" [value]="user.userSchool"></app-info-tile>
               <app-info-tile icon="work_outline" label="Job title" [value]="user.userJobTitle"></app-info-tile>
               <app-info-tile icon="phone" label="Phone number" [value]="user.userPhoneNumber"></app-info-tile>
               <app-info-tile icon="email" label="Email" [value]="user.userEmail"></app-info-tile>
               <app-info-tile icon="event" label="Registration date" [value]="formatDate(user.userRegDate)"></app-info-tile>

               <div class="flex items-center py-4 border-b border-gray-100 justify-between">
                  <div class="flex items-center">
                    <mat-icon class="text-primary mr-4">shield</mat-icon>
                    <span class="font-medium text-gray-700">User Status</span>
                  </div>
                  <app-user-status [status]="user.userStatus"></app-user-status>
               </div>

               <div class="flex items-center py-4 border-b border-gray-100 justify-between">
                  <div class="flex items-center">
                    <mat-icon class="text-primary mr-4">verified</mat-icon>
                    <div class="flex flex-col">
                       <span class="font-medium text-gray-700">User Verified</span>
                       <span class="text-xs text-gray-400">Verified when subscribing to VIP</span>
                    </div>
                  </div>
                  <app-user-status [status]="user.userIsVerified ? 'verified' : 'Not verified'"></app-user-status>
               </div>
            </div>
         </section>
      </div>

      <div class="h-20"></div>
    </div>
  `
})
export class AdminUserProfilePageComponent implements OnInit {
  user?: User;
  galleryImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
       this.loadUser(userId);
    }
  }

  async loadUser(userId: string) {
    // In a real app we'd fetch from service
    // For the port, we mock the find from appService.users
    const snapshot = (this.appService as any)._users.value.find((u: any) => u.id === userId);
    if (snapshot) {
       const data = snapshot.data();
       // Using simpler mapping for port
       this.user = data as any;
       if (this.user?.userGallery) {
          this.galleryImages = Object.values(this.user.userGallery);
       }
    }
  }

  goBack() {
    window.history.back();
  }

  copyToClipboard(text: string, label: string) {
     navigator.clipboard.writeText(text);
     alert(`${label} Copied Successfully!`);
  }

  toggleUserStatus() {
    if (!this.user) return;
    const isBlocking = this.user.userStatus === 'active';
    const newStatus = isBlocking ? 'blocked' : 'active';

    this.dialogService.confirmDialog({
       message: isBlocking ? 'User account will be Blocked!' : 'User account will be Activated!',
       positiveAction: async () => {
          await this.appService.updateUserData(this.user!.userId, { [USER_STATUS]: newStatus });
          this.user!.userStatus = newStatus;
       }
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    // Mock format for behavioral clone
    return new Date(date.seconds * 1000).toLocaleDateString();
  }
}

@Component({
  selector: 'app-info-tile',
  template: `
    <div class="flex items-center py-4 border-b border-gray-100 justify-between">
      <div class="flex items-center">
        <mat-icon class="text-primary mr-4">{{ icon }}</mat-icon>
        <span class="font-medium text-gray-700">{{ label }}</span>
      </div>
      <span class="text-gray-500">{{ value || 'N/A' }}</span>
    </div>
  `
})
export class InfoTileComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() value!: string;
}
