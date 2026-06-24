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
import {
  C_DISLIKES,
  DISLIKED_USER_ID,
  DISLIKED_BY_USER_ID,
  TIMESTAMP,
  USER_TOTAL_DISLIKED
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DislikesService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService
  ) { }

  /**
   * Save dislike
   */
  private async _saveDislike(dislikedUserId: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    await addDoc(dislikesCol, {
      [DISLIKED_USER_ID]: dislikedUserId,
      [DISLIKED_BY_USER_ID]: currentUserId,
      [TIMESTAMP]: serverTimestamp()
    });

    // Update current user total disliked profiles
    await this.userService.updateUserData(currentUserId, {
      [USER_TOTAL_DISLIKED]: increment(1)
    });
  }

  /**
   * Dislike user profile
   */
  dislikeUser(dislikedUserId: string, onDislikeResult: (success: boolean) => void): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    const q = query(
      dislikesCol,
      where(DISLIKED_BY_USER_ID, '==', currentUserId),
      where(DISLIKED_USER_ID, '==', dislikedUserId)
    );

    from(getDocs(q)).subscribe({
      next: async (snapshot) => {
        if (snapshot.empty) {
          await this._saveDislike(dislikedUserId);
          onDislikeResult(true);
          console.log('dislikeUser() -> success');
        } else {
          onDislikeResult(false);
          console.log('You already disliked the user');
        }
      },
      error: (err) => {
        console.error('dislikeUser() -> error:', err);
      }
    });
  }

  /**
   * Get disliked profiles for current user
   */
  getDislikedUsers(
    withLimit: boolean,
    loadMore: boolean = false,
    userLastDoc?: DocumentSnapshot<DocumentData>
  ): Observable<DocumentSnapshot<DocumentData>[]> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return of([]);

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    let q = query(
      dislikesCol,
      where(DISLIKED_BY_USER_ID, '==', currentUserId),
      orderBy(TIMESTAMP, 'desc')
    );

    if (loadMore && userLastDoc) {
      q = query(q, startAfter(userLastDoc));
    }

    if (withLimit) {
      q = query(q, limit(20));
    }

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs),
      catchError(error => {
        console.error('getDislikedUsers() -> error:', error);
        return of([]);
      })
    );
  }

  /**
   * Undo disliked profile
   */
  async deleteDislikedUser(dislikedUserId: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    const currentUser = this.userService.currentUser;
    if (!currentUserId || !currentUser) return;

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    const q = query(
      dislikesCol,
      where(DISLIKED_USER_ID, '==', dislikedUserId),
      where(DISLIKED_BY_USER_ID, '==', currentUserId)
    );

    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await deleteDoc(doc(this.firestore, C_DISLIKES, snapshot.docs[0].id));

        // Decrement current user total dislikes
        const totalDisliked = (currentUser.userTotalDisliked || 0) - 1;
        await this.userService.updateUserData(currentUserId, {
          [USER_TOTAL_DISLIKED]: Math.max(0, totalDisliked)
        });
        console.log('deleteDislike() -> success');
      } else {
        console.log('deleteDislike() -> doc does not exists');
      }
    } catch (error) {
      console.error('deleteDislike() -> error:', error);
    }
  }

  /**
   * Delete all disliked profiles for current user
   */
  async deleteDislikedUsers(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    const q = query(dislikesCol, where(DISLIKED_BY_USER_ID, '==', currentUserId));

    try {
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_DISLIKES, d.id)));
      await Promise.all(deletePromises);
      console.log('deleteDislikedUsers() -> deleted');
    } catch (error) {
      console.error('deleteDislikedUsers() -> error:', error);
    }
  }

  /**
   * Delete current user from profiles who disliked them
   */
  async deleteDislikedMeUsers(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const dislikesCol = collection(this.firestore, C_DISLIKES);
    const q = query(dislikesCol, where(DISLIKED_USER_ID, '==', currentUserId));

    try {
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(this.firestore, C_DISLIKES, d.id)));
      await Promise.all(deletePromises);
      console.log('deleteDislikedMeUsers() -> deleted');
    } catch (error) {
      console.error('deleteDislikedMeUsers() -> error:', error);
    }
  }
}
