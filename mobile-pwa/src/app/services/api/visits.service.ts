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
  DocumentData
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { NotificationsService } from './notifications.service';
import {
  C_VISITS,
  VISITED_USER_ID,
  VISITED_BY_USER_ID,
  TIMESTAMP,
  USER_TOTAL_VISITS,
  APP_NAME
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService,
    private notificationsService: NotificationsService
  ) { }

  /**
   * Save visit in database
   */
  private async _saveVisit(
    visitedUserId: string,
    userDeviceToken: string,
    nMessage: string
  ): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const visitsCol = collection(this.firestore, C_VISITS);
    await addDoc(visitsCol, {
      [VISITED_USER_ID]: visitedUserId,
      [VISITED_BY_USER_ID]: currentUserId,
      [TIMESTAMP]: serverTimestamp()
    });

    // Update user total visits
    await this.userService.updateUserData(visitedUserId, {
      [USER_TOTAL_VISITS]: increment(1)
    });

    // Save notification
    await this.notificationsService.saveNotification({
      nReceiverId: visitedUserId,
      nType: 'visit',
      nMessage: nMessage
    });

    // Send push notification
    await this.notificationsService.sendPushNotification({
      nTitle: APP_NAME,
      nBody: nMessage,
      nType: 'visit',
      nSenderId: currentUserId,
      nUserDeviceToken: userDeviceToken
    });
  }

  /**
   * View user profile and increment visits
   */
  visitUserProfile(
    visitedUserId: string,
    userDeviceToken: string,
    nMessage: string
  ): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId || visitedUserId === currentUserId) return;

    const visitsCol = collection(this.firestore, C_VISITS);
    const q = query(
      visitsCol,
      where(VISITED_BY_USER_ID, '==', currentUserId),
      where(VISITED_USER_ID, '==', visitedUserId)
    );

    from(getDocs(q)).subscribe({
      next: async (snapshot) => {
        if (snapshot.empty) {
          await this._saveVisit(visitedUserId, userDeviceToken, nMessage);
          console.log('visitUserProfile() -> success');
        } else {
          console.log('You already visited the user');
        }
      },
      error: (err) => {
        console.error('visitUserProfile() -> error:', err);
      }
    });
  }

  /**
   * Get users who visited current user profile
   */
  getUserVisits(loadMore: boolean = false, userLastDoc?: DocumentSnapshot<DocumentData>): Observable<DocumentSnapshot<DocumentData>[]> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return of([]);

    const visitsCol = collection(this.firestore, C_VISITS);
    let q = query(
      visitsCol,
      where(VISITED_USER_ID, '==', currentUserId),
      orderBy(TIMESTAMP, 'desc'),
      limit(20)
    );

    if (loadMore && userLastDoc) {
      q = query(q, startAfter(userLastDoc));
    }

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs),
      catchError(error => {
        console.error('getUserVisits() -> error:', error);
        return of([]);
      })
    );
  }

  /**
   * Delete visited users by current user
   */
  async deleteVisitedUsers(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const visitsCol = collection(this.firestore, C_VISITS);
    const q = query(visitsCol, where(VISITED_BY_USER_ID, '==', currentUserId));

    try {
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_VISITS, d.id)));
      await Promise.all(deletePromises);
      console.log('deleteVisitedUsers() -> deleted');
    } catch (error) {
      console.error('deleteVisitedUsers() -> error:', error);
    }
  }
}
