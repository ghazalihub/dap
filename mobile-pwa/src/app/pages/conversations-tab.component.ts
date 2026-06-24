import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { ConversationsService } from '../services/api/conversations.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import {
  USER_ID,
  USER_PROFILE_PHOTO,
  USER_FULLNAME,
  MESSAGE_READ,
  MESSAGE_TYPE,
  LAST_MESSAGE,
  TIMESTAMP
} from '../constants/constants';

@Component({
  selector: 'app-conversations-tab',
  template: `
    <div class="h-full flex flex-col bg-white">
      <!-- Header -->
      <div class="p-4 border-b flex items-center">
        <mat-icon class="text-primary mr-2">chat</mat-icon>
        <h2 class="text-xl font-bold">{{ i18n.translate('chats') }}</h2>
      </div>

      <!-- Conversations list -->
      <div class="flex-grow overflow-hidden relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && conversations.length === 0" class="h-full">
          <app-no-data
            [title]="i18n.translate('no_conversation')"
            message="Your chats will appear here.">
          </app-no-data>
        </div>

        <div *ngIf="!isLoading && conversations.length > 0" class="h-full overflow-y-auto">
          <mat-list>
            <ng-container *ngFor="let conv of conversations">
              <mat-list-item
                (click)="goToChat(conv)"
                [class.bg-primary-light]="!conv.get(MESSAGE_READ)"
                class="hover:bg-gray-50 border-b border-gray-100 py-4">

                <img matListItemIcon [src]="conv.get(USER_PROFILE_PHOTO)" class="w-12 h-12 rounded-full object-cover">

                <div matListItemTitle class="font-bold text-lg">
                  {{ conv.get(USER_FULLNAME).split(' ')[0] }}
                </div>

                <div matListItemLine class="text-sm text-gray-500">
                  <ng-container *ngIf="conv.get(MESSAGE_TYPE) === 'text'; else photoMsg">
                    {{ conv.get(LAST_MESSAGE) }}
                  </ng-container>
                  <ng-template #photoMsg>
                    <div class="flex items-center text-primary">
                      <mat-icon class="text-sm mr-1">photo_camera</mat-icon>
                      <span>{{ i18n.translate('photo') }}</span>
                    </div>
                  </ng-template>
                </div>

                <div matListItemMeta class="flex flex-col items-end">
                   <span class="text-[10px] text-gray-400 mb-1">{{ formatTime(conv.get(TIMESTAMP)) }}</span>
                   <app-custom-badge *ngIf="!conv.get(MESSAGE_READ)" [label]="i18n.translate('new')"></app-custom-badge>
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
export class ConversationsTabComponent implements OnInit {
  conversations: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;

  constructor(
    private conversationsService: ConversationsService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private mobileDialogService: MobileDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.conversationsService.getConversations().subscribe(snapshot => {
      this.conversations = snapshot.docs;
      this.isLoading = false;
    });
  }

  async goToChat(conv: DocumentSnapshot<DocumentData>) {
    // 1. Mark as read
    if (!conv.get(MESSAGE_READ)) {
      await updateDoc(conv.ref, { [MESSAGE_READ]: true });
    }

    // 2. Get user object and navigate
    const userId = conv.get(USER_ID);
    const user = await this.userService.getUserObject(userId);
    this.router.navigate(['/chat', userId], { state: { user } });
  }

  formatTime(timestamp: Timestamp): string {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    // Simplified timeago behavioral clone
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
