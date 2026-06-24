import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import {
  C_CONNECTIONS,
  C_MATCHES,
  TIMESTAMP,
  C_LIKES,
  LIKED_USER_ID,
  LIKED_BY_USER_ID
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  /**
   * Save match
   */
  private async _saveMatch(docUserId: string, matchedWithUserId: string): Promise<void> {
    const matchDocRef = doc(
      this.firestore,
      `${C_CONNECTIONS}/${docUserId}/${C_MATCHES}/${matchedWithUserId}`
    );
    await setDoc(matchDocRef, {
      [TIMESTAMP]: serverTimestamp()
    });
  }

  /**
   * Get current user matches
   */
  getMatches(): Observable<DocumentSnapshot<DocumentData>[]> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return of([]);

    const matchesCol = collection(
      this.firestore,
      `${C_CONNECTIONS}/${currentUserId}/${C_MATCHES}`
    );
    const q = query(matchesCol, orderBy(TIMESTAMP, 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs),
      catchError(error => {
        console.error('getMatches() -> error:', error);
        return of([]);
      })
    );
  }

  /**
   * Delete match
   */
  async deleteMatch(matchedUserId: string): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    // Delete match for current user
    const currentUserMatchRef = doc(
      this.firestore,
      `${C_CONNECTIONS}/${currentUserId}/${C_MATCHES}/${matchedUserId}`
    );
    await deleteDoc(currentUserMatchRef);

    // Delete the current user id from matched user list
    const matchedUserMatchRef = doc(
      this.firestore,
      `${C_CONNECTIONS}/${matchedUserId}/${C_MATCHES}/${currentUserId}`
    );
    await deleteDoc(matchedUserMatchRef);
  }

  /**
   * Check if It's Match
   */
  checkMatch(userId: string, onMatchResult: (isMatch: boolean) => void): void {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    const likesCol = collection(this.firestore, C_LIKES);
    const q = query(
      likesCol,
      where(LIKED_USER_ID, '==', currentUserId),
      where(LIKED_BY_USER_ID, '==', userId)
    );

    from(getDocs(q)).subscribe({
      next: async (snapshot) => {
        if (!snapshot.empty) {
          // It's Match
          onMatchResult(true);

          // Save match for current user
          await this._saveMatch(currentUserId, userId);

          // Save match copy for matched user
          await this._saveMatch(userId, currentUserId);

          console.log('checkMatch() -> true');
        } else {
          onMatchResult(false);
          console.log('checkMatch() -> false');
        }
      },
      error: (err) => {
        console.error('checkMatch() -> error:', err);
      }
    });
  }
}
