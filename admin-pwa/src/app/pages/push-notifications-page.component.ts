import { Component } from '@angular/core';
import { AppService } from '../services/core/app.service';

@Component({
  selector: 'app-admin-push-notifications',
  template: `
    <div class="h-screen flex flex-col bg-gray-50 items-center justify-center p-4">
      <mat-card class="max-w-md w-full p-8 shadow-2xl rounded-2xl bg-white border border-gray-100">
        <div class="text-center mb-8">
           <mat-icon class="text-primary text-6xl h-20 w-20 mb-4">notifications_active</mat-icon>
           <h1 class="text-2xl font-bold text-gray-800">Push Notifications</h1>
           <p class="text-gray-500 mt-2">Send push notifications to all users</p>
        </div>

        <form class="space-y-6" (submit)="sendNotification()">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Text message</mat-label>
            <mat-icon matPrefix>mail_outline</mat-icon>
            <textarea matInput [(ngModel)]="message" name="message" rows="5" placeholder="Write message" required></textarea>
          </mat-form-field>

          <button mat-flat-button color="primary" class="w-full py-6 text-lg font-bold rounded-full shadow-lg"
                  [disabled]="!message.trim()" type="submit">
            SEND MESSAGE
          </button>
        </form>
      </mat-card>
    </div>
  `
})
export class AdminPushNotificationsPageComponent {
  message = '';

  constructor(private appService: AppService) {}

  async sendNotification() {
    if (!this.message.trim()) return;

    await this.appService.sendPushNotification({
      nBody: this.message,
      onSuccess: () => {
        alert('Push Notification Sent successfully!');
        this.message = '';
      },
      onError: () => alert('Error while sending push notification!')
    });
  }
}
