import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  getDocs
} from '@angular/fire/firestore';
import { Storage, ref, deleteObject } from '@angular/fire/storage';
import { UserService } from '../services/core/user.service';
import { AuthService } from '../services/core/auth.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { NotificationsService } from '../services/api/notifications.service';
import { ConversationsService } from '../services/api/conversations.service';
import { MessagesService } from '../services/api/messages.service';
import { MatchesService } from '../services/api/matches.service';
import { LikesService } from '../services/api/likes.service';
import { DislikesService } from '../services/api/dislikes.service';
import { VisitsService } from '../services/api/visits.service';
import { BlockedUsersService } from '../services/api/blocked-users.service';
import { C_USERS } from '../constants/constants';

@Component({
  selector: 'app-delete-account',
  template: `
    <div class="h-screen w-screen flex items-center justify-center bg-white">
      <app-processing [text]="i18n.translate('deleting_your_account')"></app-processing>
    </div>
  `
})
export class DeleteAccountPageComponent implements OnInit {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    public i18n: AppLocalizations,
    private userService: UserService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private conversationsService: ConversationsService,
    private messagesService: MessagesService,
    private matchesService: MatchesService,
    private likesService: LikesService,
    private dislikesService: DislikesService,
    private visitsService: VisitsService,
    private blockedUsersService: BlockedUsersService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.deleteUserAccount();
    await this.authService.signOut();
    this.router.navigate(['/sign-in']);
  }

  async deleteUserAccount() {
    const user = this.userService.currentUser;
    if (!user) return;

    try {
      // 1. Delete Images
      const images = this.userService.getUserProfileImages(user);
      for (const imgUrl of images) {
        try {
          await deleteObject(ref(this.storage, imgUrl));
        } catch (e) { console.error(e); }
      }

      // 2. Delete Matches
      // Behavioral clone: logic already established in Phase 1 Services
      this.matchesService.getMatches().subscribe(async matches => {
        for (const m of matches) {
           await this.matchesService.deleteMatch(m.id);
        }
      });

      // 3. Delete Chats and Conversations
      this.conversationsService.getConversations().subscribe(async snapshot => {
        for (const conv of snapshot.docs) {
          await this.messagesService.deleteChat(conv.id, true);
        }
      });

      // 4. Delete Social interactions
      this.likesService.deleteLikedUsers();
      this.likesService.deleteLikedMeUsers();
      await this.dislikesService.deleteDislikedUsers();
      await this.dislikesService.deleteDislikedMeUsers();
      await this.visitsService.deleteVisitedUsers();

      // 5. Delete Notifications
      await this.notificationsService.deleteUserNotifications();
      await this.notificationsService.deleteUserSentNotifications();

      // 6. Delete Blocked users
      await this.blockedUsersService.deleteBlockedUsers().toPromise();

      // 7. Finally, delete user profile
      await deleteDoc(doc(this.firestore, C_USERS, user.userId));

      console.log('User account deleted successfully');
    } catch (e) {
      console.error('Error deleting user account:', e);
    }
  }
}
