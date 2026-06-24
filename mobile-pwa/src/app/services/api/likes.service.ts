import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  increment,
  startAfter,
  limit,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { NotificationsService } from './notifications.service';
import {
  C_LIKES,
  LIKED_USER_ID,
  LIKED_BY_USER_ID,
  TIMESTAMP,
  USER_TOTAL_LIKES,
  APP_NAME
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService,
    private notificationsService: NotificationsService
  ) { }

  /**
   * Save liked user
   */
  private async _saveLike(
    likedUserId: string,
    userDeviceToken: string,
    nMessage: string
  ): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    await addDoc(likesCol, {
      [LIKED_USER_ID]: likedUserId,
      [LIKED_BY_USER_ID]: currentUserId,
      [TIMESTAMP]: serverTimestamp()
    });

    // Update user total likes
    await this.userService.updateUserData(likedUserId, {
      [USER_TOTAL_LIKES]: increment(1)
    });

    // Save notification
    await this.notificationsService.saveNotification({
      nReceiverId: likedUserId,
      nType: 'like',
      nMessage: nMessage
    });

    // Send push notification
    await this.notificationsService.sendPushNotification({
      nTitle: APP_NAME,
      nBody: nMessage,
      nType: 'like',
      nSenderId: currentUserId,
      nUserDeviceToken: userDeviceToken
    });
  }

  /**
   * Like user profile
   */
  likeUser(
    likedUserId: string,
    userDeviceToken: string,
    nMessage: string,
    onLikeResult: (success: boolean) => void
  ): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    const q = query(
      likesCol,
      where(LIKED_BY_USER_ID, '==', currentUserId),
      where(LIKED_USER_ID, '==', likedUserId)
    );

    from(getDocs(q)).subscribe({
      next: async (snapshot) => {
        if (snapshot.empty) {
          onLikeResult(true);
          await this._saveLike(likedUserId, userDeviceToken, nMessage);
          console.log('likeUser() -> success');
        } else {
          onLikeResult(false);
          console.log('You already liked the user');
        }
      },
      error: (err) => {
        console.error('likeUser() -> error:', err);
      }
    });
  }

  /**
   * Get users who liked current user profile
   */
  getLikedMeUsers(loadMore: boolean = false, userLastDoc?: DocumentSnapshot<DocumentData>): Observable<DocumentSnapshot<DocumentData>[]> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return of([]);

    const likesCol = collection(this.firestore, C_LIKES);
    let q = query(
      likesCol,
      where(LIKED_USER_ID, '==', currentUserId),
      orderBy(TIMESTAMP, 'desc'),
      limit(20)
    );

    if (loadMore && userLastDoc) {
      q = query(q, startAfter(userLastDoc));
    }

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs),
      catchError(error => {
        console.error('getLikedMeUsers() -> error:', error);
        return of([]);
      })
    );
  }

  /**
   * Delete liked profile
   */
  deleteLike(likedUserId: string): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    const q = query(
      likesCol,
      where(LIKED_USER_ID, '==', likedUserId),
      where(LIKED_BY_USER_ID, '==', currentUserId)
    );

    getDocs(q).then(snapshot => {
      if (!snapshot.empty) {
        deleteDoc(doc(this.firestore, C_LIKES, snapshot.docs[0].id));
      }
    }).catch(error => {
      console.error('deleteLike() -> error:', error);
    });
  }

  /**
   * Delete liked profile ids by current user
   */
  deleteLikedUsers(): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    const q = query(likesCol, where(LIKED_BY_USER_ID, '==', currentUserId));

    getDocs(q).then(snapshot => {
      snapshot.docs.forEach(d => deleteDoc(doc(this.firestore, C_LIKES, d.id)));
      console.log('deleteLikedUsers() -> deleted');
    });
  }

  /**
   * Delete user id from profiles who liked the current user
   */
  deleteLikedMeUsers(): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    const q = query(likesCol, where(LIKED_USER_ID, '==', currentUserId));

    getDocs(q).then(snapshot => {
      snapshot.docs.forEach(d => deleteDoc(doc(this.firestore, C_LIKES, d.id)));
      console.log('deleteLikedMeUsers() -> deleted');
    });
  }
}
