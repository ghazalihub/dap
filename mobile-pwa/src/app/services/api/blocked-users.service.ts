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
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import {
  C_BLOCKED_USERS,
  BLOCKED_USER_ID,
  BLOCKED_BY_USER_ID,
  TIMESTAMP,
  USER_ID
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class BlockedUsersService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  /**
   * Save blocked user in database
   */
  private _saveBlockedUser(blockedUserId: string): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(null);

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    return from(addDoc(blockedUsersCol, {
      [BLOCKED_USER_ID]: blockedUserId,
      [BLOCKED_BY_USER_ID]: userId,
      [TIMESTAMP]: serverTimestamp()
    }));
  }

  /**
   * Get blocked profiles for current user
   */
  getBlockedUsers(): Observable<DocumentSnapshot<DocumentData>[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of([]);

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_BY_USER_ID, '==', userId),
      orderBy(TIMESTAMP, 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs),
      catchError(error => {
        console.error('getBlockedUsers() -> error:', error);
        return of([]);
      })
    );
  }

  /**
   * Remove Blocked Profiles from the list
   */
  async removeBlockedUsers(allUsers: DocumentSnapshot<DocumentData>[]): Promise<void> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_BY_USER_ID, '==', userId)
    );

    const blockedProfilesSnapshot = await getDocs(q);
    const blockedProfiles = blockedProfilesSnapshot.docs;

    if (blockedProfiles.length > 0) {
      const blockedIds = new Set(blockedProfiles.map(doc => doc.get(BLOCKED_USER_ID)));
      for (let i = allUsers.length - 1; i >= 0; i--) {
        if (blockedIds.has(allUsers[i].get(USER_ID))) {
          allUsers.splice(i, 1);
        }
      }
    }
  }

  /**
   * Block user profile
   */
  blockUser(blockedUserId: string): Observable<boolean> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(false);

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_BY_USER_ID, '==', userId),
      where(BLOCKED_USER_ID, '==', blockedUserId)
    );

    return from(getDocs(q)).pipe(
      switchMap(snapshot => {
        if (snapshot.empty) {
          return this._saveBlockedUser(blockedUserId).pipe(
            map(() => {
              console.log('blockUser() -> success');
              return true;
            })
          );
        } else {
          console.log('blockUser() -> You already blocked this user');
          return of(false);
        }
      }),
      catchError(error => {
        console.error('blockUser() -> error:', error);
        return of(false);
      })
    );
  }

  /**
   * Check Blocked profile status
   */
  isBlocked(blockedUserId: string, blockedByUserId: string): Observable<boolean> {
    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_BY_USER_ID, '==', blockedByUserId),
      where(BLOCKED_USER_ID, '==', blockedUserId)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => !snapshot.empty),
      catchError(error => {
        console.error('isBlocked() -> error:', error);
        return of(false);
      })
    );
  }

  /**
   * Undo blocked profile
   */
  deleteBlockedUser(blockedUserId: string): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(undefined);

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_USER_ID, '==', blockedUserId),
      where(BLOCKED_BY_USER_ID, '==', userId)
    );

    return from(getDocs(q)).pipe(
      switchMap(async snapshot => {
        if (!snapshot.empty) {
          const ref = doc(this.firestore, C_BLOCKED_USERS, snapshot.docs[0].id);
          await deleteDoc(ref);
          console.log('deleteblock() -> success');
        } else {
          console.log('deleteblock() -> doc does not exists');
        }
      }),
      catchError(error => {
        console.error('deleteblock() -> error:', error);
        return of(undefined);
      })
    );
  }

  /**
   * Delete all Blocked Users for current user
   */
  deleteBlockedUsers(): Observable<void> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return of(undefined);

    const blockedUsersCol = collection(this.firestore, C_BLOCKED_USERS);
    const q = query(
      blockedUsersCol,
      where(BLOCKED_BY_USER_ID, '==', userId)
    );

    return from(getDocs(q)).pipe(
      switchMap(async snapshot => {
        if (!snapshot.empty) {
          const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_BLOCKED_USERS, d.id)));
          await Promise.all(deletePromises);
          console.log('deleteblockedUsers() -> success');
        }
      }),
      catchError(error => {
        console.error('deleteblockedUsers() -> error:', error);
        return of(undefined);
      })
    );
  }
}
