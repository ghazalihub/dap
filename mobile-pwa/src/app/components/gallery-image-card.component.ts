import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { VipDialogComponent } from './vip-dialog.component';

@Component({
  selector: 'app-gallery-image-card',
  template: `
    <div class="relative pt-[100%] cursor-pointer" (click)="selectImage()">
      <div class="absolute inset-0 p-1">
        <mat-card class="h-full w-full bg-gray-300 overflow-hidden flex items-center justify-center rounded-lg shadow-sm">
          <img *ngIf="imageUrl" [src]="imageUrl" class="w-full h-full object-cover">
          <img *ngIf="!imageUrl" [src]="placeholder" class="w-12 h-12 object-contain opacity-50">
        </mat-card>

        <div class="absolute right-2 bottom-2">
          <button mat-mini-fab color="primary" class="w-8 h-8 flex items-center justify-center" (click)="handleAction($event)">
            <mat-icon class="text-white text-lg">{{ imageUrl ? 'close' : 'add' }}</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class GalleryImageCardComponent {
  @Input() imageUrl: string | null = null;
  @Input() placeholder: string = 'assets/images/camera.png';
  @Input() index!: number;

  constructor(
    private userService: UserService,
    public i18n: AppLocalizations,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private mobileDialogService: MobileDialogService
  ) {}

  handleAction(event: Event) {
    event.stopPropagation();
    if (this.imageUrl) {
      this.deleteGalleryImage();
    } else {
      this.selectImage();
    }
  }

  async selectImage() {
    if (!this.userService.userIsVip && this.index > 3) {
      this.dialog.open(VipDialogComponent);
      return;
    }

    // Logic for ImageSourceSheet and file selection would go here
    // In web, we'd trigger an <input type="file">
    console.log('Select image for index', this.index);
  }

  async deleteGalleryImage() {
    if (!this.userService.userIsVip && this.index > 3) {
      this.dialog.open(VipDialogComponent);
      return;
    }

    this.mobileDialogService.confirmDialog({
      message: this.i18n.translate('photo_will_be_deleted'),
      positiveAction: async () => {
        if (this.imageUrl) {
          await this.userService.deleteGalleryImage(this.imageUrl, this.index);
          console.log('Photo deleted');
        }
      }
    });
  }
}
