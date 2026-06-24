import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSnapshot, DocumentData, Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MessagesService } from '../services/api/messages.service';
import { MatchesService } from '../services/api/matches.service';
import { LikesService } from '../services/api/likes.service';
import { NotificationsService } from '../services/api/notifications.service';
import { BlockedUsersService } from '../services/api/blocked-users.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ProgressDialogComponent } from '../components/progress-dialog.component';
import { User } from '../models/user.model';
import {
  APP_NAME,
  MESSAGE_TYPE,
  MESSAGE_TEXT,
  MESSAGE_IMG_LINK,
  TIMESTAMP,
  USER_ID
} from '../constants/constants';

@Component({
  selector: 'app-chat',
  template: `
    <div class="h-screen flex flex-col bg-white">
      <!-- App Bar -->
      <header class="flex items-center p-2 border-b bg-white">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>

        <div class="flex items-center flex-grow cursor-pointer" (click)="viewProfile()">
          <img [src]="user.userProfilePhoto" class="w-10 h-10 rounded-full object-cover mr-3">
          <span class="text-lg font-bold truncate">{{ user.userFullname }}</span>
        </div>

        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="deleteChat()">
            <mat-icon class="text-primary">delete</mat-icon>
            <span>{{ i18n.translate('delete_conversation') }}</span>
          </button>
          <button mat-menu-item (click)="deleteMatch()">
            <mat-icon class="text-primary">highlight_off</mat-icon>
            <span>{{ i18n.translate('delete_match') }}</span>
          </button>
          <button mat-menu-item (click)="toggleBlock()">
            <mat-icon class="text-primary">block</mat-icon>
            <span>{{ isRemoteUserBlocked ? i18n.translate('UNBLOCK') : i18n.translate('BLOCK') }}</span>
          </button>
        </mat-menu>
      </header>

      <!-- Messages List -->
      <div class="flex-grow overflow-y-auto p-2 flex flex-col-reverse" #scrollContainer>
        <div *ngFor="let msg of messages" class="w-full">
           <app-chat-message
             [isUserSender]="msg.isUserSender"
             [isImage]="msg.isImage"
             [userPhotoLink]="msg.userPhotoLink"
             [textMessage]="msg.textMessage"
             [imageLink]="msg.imageLink"
             [timeAgo]="msg.timeAgo">
           </app-chat-message>
        </div>
      </div>

      <!-- Text Composer -->
      <div class="p-2 border-t bg-gray-50 flex items-end">
        <button mat-icon-button (click)="selectImage()">
          <mat-icon class="text-gray-500">camera_alt</mat-icon>
        </button>

        <mat-form-field appearance="fill" class="flex-grow px-2 no-padding-bottom">
          <textarea matInput [(ngModel)]="messageText"
                    [placeholder]="i18n.translate('type_a_message')"
                    cdkTextareaAutosize #autosize="cdkTextareaAutosize"
                    cdkAutosizeMinRows="1" cdkAutosizeMaxRows="4"></textarea>
        </mat-form-field>

        <button mat-icon-button color="primary" [disabled]="!messageText.trim()" (click)="sendMessage()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .no-padding-bottom ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class ChatPageComponent implements OnInit, OnDestroy {
  user!: User;
  messageText: string = '';
  messages: any[] = [];
  isRemoteUserBlocked: boolean = false;
  isLocalUserBlocked: boolean = false;

  private subs = new Subscription();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messagesService: MessagesService,
    private matchesService: MatchesService,
    private likesService: LikesService,
    private notificationsService: NotificationsService,
    private blockedUsersService: BlockedUsersService,
    private userService: UserService,
    public i18n: AppLocalizations,
    private mobileDialogService: MobileDialogService,
    private dialog: MatDialog
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'];
    }
  }

  ngOnInit() {
    if (!this.user) {
       this.router.navigate(['/home']);
       return;
    }

    // Load messages
    this.subs.add(
      this.messagesService.getMessages(this.user.userId).subscribe(snapshot => {
        this.messages = snapshot.docs.map(doc => {
          const data = doc.data();
          const isUserSender = data[USER_ID] === this.userService.currentUser?.userId;
          return {
            isUserSender,
            isImage: data[MESSAGE_TYPE] === 'image',
            userPhotoLink: isUserSender ? this.userService.currentUser?.userProfilePhoto : this.user.userProfilePhoto,
            textMessage: data[MESSAGE_TEXT],
            imageLink: data[MESSAGE_IMG_LINK],
            timeAgo: this.formatTime(data[TIMESTAMP])
          };
        }).reverse();
      })
    );

    this.checkBlockedStatus();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  formatTime(timestamp: Timestamp): string {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  viewProfile() {
    this.router.navigate(['/profile', this.user.userId], { state: { user: this.user, showButtons: false } });
  }

  async sendMessage(type: 'text' | 'image' = 'text', imgFile?: File) {
    if (this.isLocalUserBlocked) {
      this.mobileDialogService.errorDialog(this.i18n.translate('oops_your_profile_has_been_blocked_by_this_user_so_you_can_send_a_message'));
      return;
    }

    let imageUrl = '';
    if (type === 'image' && imgFile) {
       const pr = this.dialog.open(ProgressDialogComponent, { data: { message: this.i18n.translate('sending') } });
       imageUrl = await this.userService.uploadFile(imgFile, 'uploads/messages', this.userService.currentUser!.userId);
       pr.close();
    }

    const text = this.messageText.trim();
    this.messageText = '';

    await this.messagesService.saveMessage({
      type,
      senderId: this.userService.currentUser!.userId,
      receiverId: this.user.userId,
      fromUserId: this.userService.currentUser!.userId,
      userPhotoLink: this.user.userProfilePhoto,
      userFullName: this.user.userFullname,
      textMsg: text,
      imgLink: imageUrl,
      isRead: true
    });

    // Save for receiver
    await this.messagesService.saveMessage({
      type,
      senderId: this.user.userId,
      receiverId: this.userService.currentUser!.userId,
      fromUserId: this.userService.currentUser!.userId,
      userPhotoLink: this.userService.currentUser!.userProfilePhoto,
      userFullName: this.userService.currentUser!.userFullname,
      textMsg: text,
      imgLink: imageUrl,
      isRead: false
    });

    await this.notificationsService.sendPushNotification({
      nTitle: APP_NAME,
      nBody: `${this.userService.currentUser?.userFullname}, ${this.i18n.translate('sent_a_message_to_you')}`,
      nType: 'message',
      nSenderId: this.userService.currentUser!.userId,
      nUserDeviceToken: this.user.userDeviceToken
    });
  }

  selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) this.sendMessage('image', file);
    };
    input.click();
  }

  async deleteChat() {
    this.mobileDialogService.confirmDialog({
      title: this.i18n.translate('delete_conversation'),
      message: this.i18n.translate('conversation_will_be_deleted'),
      positiveAction: async () => {
        await this.messagesService.deleteChat(this.user.userId);
      }
    });
  }

  async deleteMatch() {
    this.mobileDialogService.confirmDialog({
      title: this.i18n.translate('delete_match'),
      message: `${this.i18n.translate('are_you_sure_you_want_to_delete_your_match_with')}: ${this.user.userFullname}?`,
      positiveAction: async () => {
        await this.matchesService.deleteMatch(this.user.userId);
        await this.messagesService.deleteChat(this.user.userId);
        this.router.navigate(['/home']);
      }
    });
  }

  async toggleBlock() {
    if (this.isRemoteUserBlocked) {
      this.mobileDialogService.confirmDialog({
        message: this.i18n.translate('this_profile_will_be_removed_from_the_blocked_users_list'),
        positiveAction: async () => {
          await this.blockedUsersService.deleteBlockedUser(this.user.userId).toPromise();
          this.isRemoteUserBlocked = false;
        }
      });
    } else {
      this.mobileDialogService.confirmDialog({
        message: this.i18n.translate('this_profile_will_be_blocked'),
        positiveAction: async () => {
          await this.blockedUsersService.blockUser(this.user.userId).toPromise();
          this.isRemoteUserBlocked = true;
        }
      });
    }
  }

  private checkBlockedStatus() {
    this.blockedUsersService.isBlocked(this.user.userId, this.userService.currentUser!.userId).subscribe(res => this.isRemoteUserBlocked = res);
    this.blockedUsersService.isBlocked(this.userService.currentUser!.userId, this.user.userId).subscribe(res => this.isLocalUserBlocked = res);
  }
}
