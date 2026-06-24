import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AppNotifications {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  /**
   * Handle notification click for push and database notifications
   */
  async onNotificationClick(params: {
    nType: string,
    nSenderId: string,
    nMessage: string,
    nCallInfo?: string
  }): Promise<void> {
    const userIsVip = this.userService.userIsVip;

    switch (params.nType) {
      case 'like':
        if (userIsVip) {
          this._goToProfileScreen(params.nSenderId);
        } else {
          this.router.navigate(['/profile-likes']);
        }
        break;

      case 'visit':
        if (userIsVip) {
          this._goToProfileScreen(params.nSenderId);
        } else {
          this.router.navigate(['/profile-visits']);
        }
        break;

      case 'alert':
        // Show dialog info logic
        console.log('Notification Alert:', params.nMessage);
        // This would call a global UI dialog service in a full implementation
        break;
    }
  }

  /**
   * Navigate to profile screen
   */
  private async _goToProfileScreen(userSenderId: string): Promise<void> {
    try {
      const user = await this.userService.getUserObject(userSenderId);
      this.router.navigate(['/profile', userSenderId], { state: { user } });
    } catch (e) {
      console.error('Error navigating to profile:', e);
    }
  }
}
