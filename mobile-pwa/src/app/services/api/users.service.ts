import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  DocumentSnapshot,
  DocumentData,
  Timestamp,
  orderBy,
  startAt,
  endAt
} from '@angular/fire/firestore';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as geofire from 'geofire-common';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { BlockedUsersService } from './blocked-users.service';
import {
  C_USERS,
  USER_STATUS,
  USER_LEVEL,
  USER_MAX_DISTANCE,
  USER_GEO_POINT,
  USER_ID,
  C_LIKES,
  LIKED_BY_USER_ID,
  LIKED_USER_ID,
  USER_REG_DATE,
  USER_MIN_AGE,
  USER_MAX_AGE,
  USER_BIRTH_YEAR,
  USER_BIRTH_MONTH,
  USER_BIRTH_DAY,
  DISLIKED_USER_ID
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService,
    private blockedUsersService: BlockedUsersService
  ) { }

  /**
   * Get all users with scalable geofencing
   */
  getUsers(dislikedUsers: DocumentSnapshot<DocumentData>[]): Observable<DocumentSnapshot<DocumentData>[]> {
    const currentUser = this.userService.currentUser;
    if (!currentUser) return of([]);

    const settings = currentUser.userSettings;
    const radiusInM = (settings?.[USER_MAX_DISTANCE] || 100) * 1000;
    const center = [currentUser.userGeoPoint.latitude, currentUser.userGeoPoint.longitude];

    // Each bound is a [startCode, endCode]
    const bounds = geofire.geohashQueryBounds(center as any, radiusInM);
    const usersCol = collection(this.firestore, C_USERS);

    const queries = bounds.map(b => {
      let q = query(
        usersCol,
        where(USER_STATUS, '==', 'active'),
        where(USER_LEVEL, '==', 'user'),
        orderBy(`${USER_GEO_POINT}.geohash`),
        startAt(b[0]),
        endAt(b[1])
      );
      // Note: In Firestore, you can only have inequality filters on one field.
      // So we apply the gender filter here as well if it's an equality filter.
      q = this.userService.filterUserGender(q);
      return from(getDocs(q)).pipe(map(snap => snap.docs));
    });

    return combineLatest(queries).pipe(
      switchMap(async (results) => {
        let allUsers = results.flat() as DocumentSnapshot<DocumentData>[];

        // Strict radial distance filtering (geohash is just a box)
        allUsers = allUsers.filter(userDoc => {
          const userGeo = userDoc.get(USER_GEO_POINT)?.geopoint;
          if (!userGeo) return false;

          const distance = geofire.distanceBetween(
            center as any,
            [userGeo.latitude, userGeo.longitude]
          ) * 1000; // to meters
          return distance <= radiusInM;
        });

        // Remove duplicates (docs can appear in multiple geohash boxes)
        const seen = new Set();
        allUsers = allUsers.filter(doc => {
          const id = doc.get(USER_ID);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        // Remove current user
        allUsers = allUsers.filter(userDoc => userDoc.get(USER_ID) !== currentUser.userId);

        // Remove Disliked Users
        if (dislikedUsers.length > 0) {
          const dislikedIds = new Set(dislikedUsers.map(doc => doc.get(DISLIKED_USER_ID)));
          allUsers = allUsers.filter(userDoc => !dislikedIds.has(userDoc.get(USER_ID)));
        }

        // Get Liked Profiles
        const likesCol = collection(this.firestore, C_LIKES);
        const likesQuery = query(likesCol, where(LIKED_BY_USER_ID, '==', currentUser.userId));
        const likedSnapshot = await getDocs(likesQuery);
        const likedIds = new Set(likedSnapshot.docs.map(doc => doc.get(LIKED_USER_ID)));

        // Remove Liked Profiles
        allUsers = allUsers.filter(userDoc => !likedIds.has(userDoc.get(USER_ID)));

        // Remove Blocked Profiles
        await this.blockedUsersService.removeBlockedUsers(allUsers);

        // Sort by newest
        allUsers.sort((a, b) => {
          const dateA = (a.get(USER_REG_DATE) as Timestamp).toDate();
          const dateB = (b.get(USER_REG_DATE) as Timestamp).toDate();
          return dateA.getTime() - dateB.getTime();
        });

        const minAge = settings?.[USER_MIN_AGE] || 18;
        const maxAge = settings?.[USER_MAX_AGE] || 100;

        // Filter Profile Ages
        return allUsers.filter(userDoc => {
          const birthDate = new Date(
            userDoc.get(USER_BIRTH_YEAR),
            userDoc.get(USER_BIRTH_MONTH) - 1,
            userDoc.get(USER_BIRTH_DAY)
          );
          const age = this.userService.calculateUserAge(birthDate);
          return age >= minAge && age <= maxAge;
        });
      })
    );
  }

  /**
   * Helper to calculate distance between two points in km
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
