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
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import {
  C_NOTIFICATIONS,
  N_SENDER_ID,
  N_SENDER_FULLNAME,
  N_SENDER_PHOTO_LINK,
  N_RECEIVER_ID,
  N_TYPE,
  N_MESSAGE,
  N_READ,
  TIMESTAMP,
  APP_NAME
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private firestore: Firestore,
    private functions: Functions,
    private authService: AuthService,
    private userService: UserService
  ) { }

  /**
   * Save notification in database
   */
  async saveNotification(params: {
    nReceiverId: string,
    nType: string,
    nMessage: string,
  }): Promise<void> {
    const currentUser = this.userService.currentUser;
    if (!currentUser) return;

    try {
      const notificationsCol = collection(this.firestore, C_NOTIFICATIONS);
      await addDoc(notificationsCol, {
        [N_SENDER_ID]: currentUser.userId,
        [N_SENDER_FULLNAME]: currentUser.userFullname,
        [N_SENDER_PHOTO_LINK]: currentUser.userProfilePhoto,
        [N_RECEIVER_ID]: params.nReceiverId,
        [N_TYPE]: params.nType,
        [N_MESSAGE]: params.nMessage,
        [N_READ]: false,
        [TIMESTAMP]: serverTimestamp()
      });
      console.log('saveNotification() -> success');
    } catch (e) {
      console.error('saveNotification() -> error:', e);
    }
  }

  /**
   * Notify Current User after purchasing VIP subscription
   */
  async onPurchaseNotification(nMessage: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    try {
      const notificationsCol = collection(this.firestore, C_NOTIFICATIONS);
      await addDoc(notificationsCol, {
        [N_SENDER_FULLNAME]: APP_NAME,
        [N_RECEIVER_ID]: currentUserId,
        [N_TYPE]: 'alert',
        [N_MESSAGE]: nMessage,
        [N_READ]: false,
        [TIMESTAMP]: serverTimestamp()
      });
      console.log('onPurchaseNotification() -> success');
    } catch (e) {
      console.error('onPurchaseNotification() -> error:', e);
    }
  }

  /**
   * Get stream notifications for current user
   */
  getNotifications(): Observable<QuerySnapshot<DocumentData>> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) throw new Error('User not logged in');

    const notificationsCol = collection(this.firestore, C_NOTIFICATIONS);
    const q = query(
      notificationsCol,
      where(N_RECEIVER_ID, '==', currentUserId),
      orderBy(TIMESTAMP, 'desc')
    );

    return new Observable<QuerySnapshot<DocumentData>>(subscriber => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber.next(snapshot);
      }, (error) => {
        subscriber.error(error);
      });
      return { unsubscribe };
    });
  }

  /**
   * Delete current user notifications
   */
  async deleteUserNotifications(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const notificationsCol = collection(this.firestore, C_NOTIFICATIONS);
    const q = query(notificationsCol, where(N_RECEIVER_ID, '==', currentUserId));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_NOTIFICATIONS, d.id)));
      await Promise.all(deletePromises);
      console.log('deleteUserNotifications() -> deleted');
    } catch (e) {
      console.error('deleteUserNotifications() -> error:', e);
    }
  }

  /**
   * Delete notifications sent by current user
   */
  async deleteUserSentNotifications(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const notificationsCol = collection(this.firestore, C_NOTIFICATIONS);
    const q = query(notificationsCol, where(N_SENDER_ID, '==', currentUserId));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_NOTIFICATIONS, d.id)));
      await Promise.all(deletePromises);
      console.log('deleteUserSentNotifications() -> deleted');
    } catch (e) {
      console.error('deleteUserSentNotifications() -> error:', e);
    }
  }

  /**
   * Send push notification method
   */
  async sendPushNotification(params: {
    nTitle: string,
    nBody: string,
    nType: string,
    nSenderId: string,
    nUserDeviceToken: string,
    nCallInfo?: any,
  }): Promise<void> {
    try {
      const sendPushNotificationFn = httpsCallable(this.functions, 'sendPushNotification');
      await sendPushNotificationFn({
        type: params.nType,
        title: params.nTitle,
        body: params.nBody,
        deviceToken: params.nUserDeviceToken,
        call: params.nCallInfo,
        senderId: params.nSenderId,
      });
      console.log('sendPushNotification() -> success');
    } catch (e) {
      console.error('sendPushNotification() -> error:', e);
    }
  }
}
