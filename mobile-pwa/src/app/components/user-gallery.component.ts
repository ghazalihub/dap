import { Component } from '@angular/core';
import { UserService } from '../services/core/user.service';

@Component({
  selector: 'app-user-gallery',
  template: `
    <div class="grid grid-cols-3 gap-2">
      <div *ngFor="let index of [0, 1, 2, 3, 4, 5, 6, 7, 8]">
        <app-gallery-image-card
          [imageUrl]="getImageUrl(index)"
          [placeholder]="getPlaceholder(index)"
          [index]="index">
        </app-gallery-image-card>
      </div>
    </div>
  `
})
export class UserGalleryComponent {
  constructor(public userService: UserService) {}

  getImageUrl(index: number): string | null {
    return this.userService.currentUser?.userGallery?.[`image_${index}`] || null;
  }

  getPlaceholder(index: number): string {
    if (!this.userService.userIsVip && index > 3) {
      return 'assets/images/crow_badge_small.png';
    }
    return 'assets/images/camera.png';
  }
}
