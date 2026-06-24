import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import {
  C_CONNECTIONS,
  C_CONVERSATIONS,
  TIMESTAMP,
  USER_ID,
  USER_PROFILE_PHOTO,
  USER_FULLNAME,
  MESSAGE_TYPE,
  LAST_MESSAGE,
  MESSAGE_READ
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  /**
   * Save last conversation in database
   */
  async saveConversation(params: {
    type: string,
    senderId: string,
    receiverId: string,
    userPhotoLink: string,
    userFullName: string,
    textMsg: string,
    isRead: boolean,
  }): Promise<void> {
    try {
      const conversationDocRef = doc(
        this.firestore,
        `${C_CONNECTIONS}/${params.senderId}/${C_CONVERSATIONS}/${params.receiverId}`
      );
      await setDoc(conversationDocRef, {
        [USER_ID]: params.receiverId,
        [USER_PROFILE_PHOTO]: params.userPhotoLink,
        [USER_FULLNAME]: params.userFullName,
        [MESSAGE_TYPE]: params.type,
        [LAST_MESSAGE]: params.textMsg,
        [MESSAGE_READ]: params.isRead,
        [TIMESTAMP]: serverTimestamp(),
      });
      console.log('saveConversation() -> success');
    } catch (e) {
      console.error('saveConversation() -> error:', e);
    }
  }

  /**
   * Get stream chats for current user
   */
  getConversations(): Observable<QuerySnapshot<DocumentData>> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) throw new Error('User not logged in');

    const conversationsCol = collection(
      this.firestore,
      `${C_CONNECTIONS}/${currentUserId}/${C_CONVERSATIONS}`
    );
    const q = query(conversationsCol, orderBy(TIMESTAMP, 'desc'));

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
   * Delete current user conversation
   */
  async deleteConverce(withUserId: string, isDoubleDel: boolean = false): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    // For current user
    const currentUserConvRef = doc(
      this.firestore,
      `${C_CONNECTIONS}/${currentUserId}/${C_CONVERSATIONS}/${withUserId}`
    );
    await deleteDoc(currentUserConvRef);

    // Delete the current user id from another user conversation list
    if (isDoubleDel) {
      const otherUserConvRef = doc(
        this.firestore,
        `${C_CONNECTIONS}/${withUserId}/${C_CONVERSATIONS}/${currentUserId}`
      );
      await deleteDoc(otherUserConvRef);
    }
  }
}
