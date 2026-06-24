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
  getDocs,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import {
  getStorage,
  ref,
  deleteObject
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ConversationsService } from './conversations.service';
import {
  C_MESSAGES,
  TIMESTAMP,
  USER_ID,
  MESSAGE_TYPE,
  MESSAGE_TEXT,
  MESSAGE_IMG_LINK
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private conversationsService: ConversationsService
  ) { }

  /**
   * Get stream messages for current user
   */
  getMessages(withUserId: string): Observable<QuerySnapshot<DocumentData>> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) throw new Error('User not logged in');

    const messagesCol = collection(
      this.firestore,
      `${C_MESSAGES}/${currentUserId}/${withUserId}`
    );
    const q = query(messagesCol, orderBy(TIMESTAMP));

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
   * Save chat message
   */
  async saveMessage(params: {
    type: string,
    senderId: string,
    receiverId: string,
    fromUserId: string,
    userPhotoLink: string,
    userFullName: string,
    textMsg: string,
    imgLink: string,
    isRead: boolean,
  }): Promise<void> {
    try {
      // Save message
      const messageDocRef = doc(collection(
        this.firestore,
        `${C_MESSAGES}/${params.senderId}/${params.receiverId}`
      ));
      await setDoc(messageDocRef, {
        [USER_ID]: params.fromUserId,
        [MESSAGE_TYPE]: params.type,
        [MESSAGE_TEXT]: params.textMsg,
        [MESSAGE_IMG_LINK]: params.imgLink,
        [TIMESTAMP]: serverTimestamp(),
      });

      // Save last conversation
      await this.conversationsService.saveConversation({
        type: params.type,
        senderId: params.senderId,
        receiverId: params.receiverId,
        userPhotoLink: params.userPhotoLink,
        userFullName: params.userFullName,
        textMsg: params.textMsg,
        isRead: params.isRead
      });
    } catch (e) {
      console.error('saveMessage() -> error:', e);
    }
  }

  /**
   * Delete current user chat
   */
  async deleteChat(withUserId: string, isDoubleDel: boolean = false): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const storage = getStorage();

    // Get Chat for current user
    const messagesCol01 = collection(this.firestore, `${C_MESSAGES}/${currentUserId}/${withUserId}`);
    const snapshot01 = await getDocs(messagesCol01);
    const messages01 = snapshot01.docs;

    if (messages01.length > 0) {
      for (const msg of messages01) {
        // Check msg type
        if (msg.get(MESSAGE_TYPE) === 'image' && msg.get(USER_ID) === currentUserId) {
          // Delete uploaded images by current user
          const imageRef = ref(storage, msg.get(MESSAGE_IMG_LINK));
          await deleteObject(imageRef).catch(e => console.error('Error deleting image:', e));
        }
        await deleteDoc(doc(this.firestore, `${C_MESSAGES}/${currentUserId}/${withUserId}`, msg.id));
      }

      // Delete current user conversation
      if (!isDoubleDel) {
        await this.conversationsService.deleteConverce(withUserId);
      }
    }

    if (isDoubleDel) {
      // Get messages sent by another user to be deleted
      const messagesCol02 = collection(this.firestore, `${C_MESSAGES}/${withUserId}/${currentUserId}`);
      const snapshot02 = await getDocs(messagesCol02);
      const messages02 = snapshot02.docs;

      if (messages02.length > 0) {
        for (const msg of messages02) {
          if (msg.get(MESSAGE_TYPE) === 'image' && msg.get(USER_ID) === withUserId) {
            // Delete uploaded images by another user
            const imageRef = ref(storage, msg.get(MESSAGE_IMG_LINK));
            await deleteObject(imageRef).catch(e => console.error('Error deleting image:', e));
          }
          await deleteDoc(doc(this.firestore, `${C_MESSAGES}/${withUserId}/${currentUserId}`, msg.id));
        }
      }

      // Also delete conversation for both if double delete
      await this.conversationsService.deleteConverce(withUserId, true);
    }
  }
}
