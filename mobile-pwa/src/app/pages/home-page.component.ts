import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { NotificationsService } from '../services/api/notifications.service';
import { ConversationsService } from '../services/api/conversations.service';
import { AppService } from '../services/core/app.service';
import { APP_NAME } from '../constants/constants';

@Component({
  selector: 'app-home',
  template: `
    <div class="h-screen flex flex-col bg-white">
      <!-- App Bar -->
      <header class="flex items-center justify-between p-4 border-b bg-white">
        <div class="flex items-center">
          <img src="assets/images/app_logo.png" class="w-10 h-10 mr-2">
          <h1 class="text-xl font-bold">{{ APP_NAME }}</h1>
        </div>

        <button mat-icon-button (click)="goToNotifications()" class="relative">
          <mat-icon>notifications_none</mat-icon>
          <app-notification-counter [count]="unreadNotificationsCount"></app-notification-counter>
        </button>
      </header>

      <!-- Main Content / Tabs -->
      <div class="flex-grow overflow-hidden relative">
        <ng-container [ngSwitch]="selectedIndex">
          <div *ngSwitchCase="0" class="h-full"><app-discover-tab></app-discover-tab></div>
          <div *ngSwitchCase="1" class="h-full"><app-matches-tab></app-matches-tab></div>
          <div *ngSwitchCase="2" class="h-full"><app-conversations-tab></app-conversations-tab></div>
          <div *ngSwitchCase="3" class="h-full"><app-profile-tab></app-profile-tab></div>
        </ng-container>
      </div>

      <!-- Bottom Navigation -->
      <nav class="flex border-t bg-white pb-safe">
        <button (click)="selectedIndex = 0" class="flex-1 flex flex-col items-center py-2" [class.text-primary]="selectedIndex === 0">
          <mat-icon>{{ selectedIndex === 0 ? 'search' : 'search' }}</mat-icon>
          <span class="text-[10px]">{{ i18n.translate('discover') }}</span>
        </button>

        <button (click)="selectedIndex = 1" class="flex-1 flex flex-col items-center py-2" [class.text-primary]="selectedIndex === 1">
          <mat-icon>{{ selectedIndex === 1 ? 'favorite' : 'favorite_border' }}</mat-icon>
          <span class="text-[10px]">{{ i18n.translate('matches') }}</span>
        </button>

        <button (click)="selectedIndex = 2" class="flex-1 flex flex-col items-center py-2 relative" [class.text-primary]="selectedIndex === 2">
          <mat-icon>{{ selectedIndex === 2 ? 'message' : 'chat_bubble_outline' }}</mat-icon>
          <span class="text-[10px]">{{ i18n.translate('chats') }}</span>
          <app-notification-counter [count]="unreadConversationsCount"></app-notification-counter>
        </button>

        <button (click)="selectedIndex = 3" class="flex-1 flex flex-col items-center py-2" [class.text-primary]="selectedIndex === 3">
          <mat-icon>{{ selectedIndex === 3 ? 'person' : 'person_outline' }}</mat-icon>
          <span class="text-[10px]">{{ i18n.translate('profile') }}</span>
        </button>
      </nav>
    </div>
  `
})
export class HomePageComponent implements OnInit, OnDestroy {
  APP_NAME = APP_NAME;
  selectedIndex = 0;
  unreadNotificationsCount = 0;
  unreadConversationsCount = 0;

  private subs = new Subscription();

  constructor(
    public i18n: AppLocalizations,
    private router: Router,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private conversationsService: ConversationsService
  ) {}

  ngOnInit() {
    // Listen for unread notifications
    this.subs.add(
      this.notificationsService.getNotifications().subscribe(snapshot => {
        this.unreadNotificationsCount = snapshot.docs.filter(d => !d.get('n_read')).length;
      })
    );

    // Listen for unread conversations
    this.subs.add(
      this.conversationsService.getConversations().subscribe(snapshot => {
        this.unreadConversationsCount = snapshot.docs.filter(d => !d.get('message_read')).length;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
