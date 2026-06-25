import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot, DocumentData, updateDoc, Timestamp } from '@angular/fire/firestore';
import { NotificationsService } from '../services/api/notifications.service';
import { AppNotifications } from '../services/core/app-notifications.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import {
  N_TYPE,
  N_SENDER_PHOTO_LINK,
  N_SENDER_FULLNAME,
  N_MESSAGE,
  TIMESTAMP,
  N_READ,
  N_SENDER_ID
} from '../constants/constants';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 shadow-sm">
        <div class="flex items-center">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-lg font-bold ml-2">{{ i18n.translate('notifications') }}</h1>
        </div>
        <button mat-icon-button (click)="deleteAll()">
          <mat-icon class="text-primary">delete_sweep</mat-icon>
        </button>
      </header>

      <div class="flex-grow relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && notifications.length === 0" class="h-full">
          <app-no-data [title]="i18n.translate('no_notification')"></app-no-data>
        </div>

        <div *ngIf="!isLoading && notifications.length > 0" class="h-full overflow-y-auto">
          <mat-list>
            <ng-container *ngFor="let n of notifications">
              <mat-list-item
                (click)="onNotificationClick(n)"
                [class.bg-primary-light]="!n.get(N_READ)"
                class="hover:bg-gray-50 border-b border-gray-100 py-4">

                <img matListItemIcon [src]="getNotificationIcon(n)" class="w-12 h-12 rounded-full object-cover">

                <div matListItemTitle class="font-bold text-lg">
                  {{ getSenderName(n) }}
                </div>

                <div matListItemLine class="text-sm text-gray-500 whitespace-pre-wrap">
                  {{ n.get(N_MESSAGE) }}
                </div>

                <div matListItemMeta class="flex flex-col items-end">
                   <span class="text-[10px] text-gray-400 mb-1">{{ formatTime(n.get(TIMESTAMP)) }}</span>
                   <app-custom-badge *ngIf="!n.get(N_READ)" [label]="i18n.translate('new')"></app-custom-badge>
                </div>
              </mat-list-item>
            </ng-container>
          </mat-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-primary-light { background-color: rgba(233, 30, 99, 0.1); }
  `]
})
export class NotificationsPageComponent implements OnInit {
  notifications: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;

  N_READ = N_READ;
  N_MESSAGE = N_MESSAGE;
  TIMESTAMP = TIMESTAMP;

  constructor(
    private notificationsService: NotificationsService,
    private appNotifications: AppNotifications,
    public i18n: AppLocalizations,
    private mobileDialogService: MobileDialogService
  ) {}

  ngOnInit() {
    this.notificationsService.getNotifications().subscribe(snapshot => {
      this.notifications = snapshot.docs;
      this.isLoading = false;
    });
  }

  goBack() {
    window.history.back();
  }

  getNotificationIcon(n: DocumentSnapshot<DocumentData>): string {
    return n.get(N_TYPE) === 'alert' ? 'assets/images/app_logo.png' : n.get(N_SENDER_PHOTO_LINK);
  }

  getSenderName(n: DocumentSnapshot<DocumentData>): string {
    const name = n.get(N_SENDER_FULLNAME);
    return n.get(N_TYPE) === 'alert' ? name : name.split(' ')[0];
  }

  formatTime(timestamp: Timestamp): string {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async onNotificationClick(n: DocumentSnapshot<DocumentData>) {
    if (!n.get(N_READ)) {
      await updateDoc(n.ref, { [N_READ]: true });
    }

    this.appNotifications.onNotificationClick({
      nType: n.get(N_TYPE),
      nSenderId: n.get(N_SENDER_ID),
      nMessage: n.get(N_MESSAGE)
    });
  }

  deleteAll() {
    this.mobileDialogService.confirmDialog({
      message: this.i18n.translate('all_notifications_will_be_deleted'),
      positiveAction: async () => {
        await this.notificationsService.deleteUserNotifications();
      }
    });
  }
}
