import { collection, query, where, getDocs, limit, startAt, endAt, orderBy } from 'firebase/firestore';
import { db } from '../api/firebase';
import { CompatibilityHelper } from '../utils/compatibilityHelper';
import type { User } from '../types/user';
import * as geofire from 'geofire-common';

export const fetchDiscoveryUsers = async (currentUser: User, mode: string = 'standard', radiusKm: number = 50) => {
  const usersRef = collection(db, 'users');

  const oppositeGender = currentUser.user_gender === 'Male' ? 'Female' : 'Male';
  const center = [currentUser.user_location?.latitude || 0, currentUser.user_location?.longitude || 0] as geofire.Geopoint;

  // Real Geo-query using geohash bounds
  const bounds = geofire.geohashQueryBounds(center, radiusKm * 1000);
  const promises = [];
  for (const b of bounds) {
    const q = query(
      usersRef,
      orderBy('geohash'),
      startAt(b[0]),
      endAt(b[1]),
      limit(50)
    );
    promises.push(getDocs(q));
  }

  const snapshots = await Promise.all(promises);
  let users: User[] = [];

  snapshots.forEach(snap => {
    snap.docs.forEach(doc => {
      const u = doc.data() as User;
      if (u.user_id !== currentUser.user_id && u.user_gender === oppositeGender && u.user_status === 'active') {
         users.push(u);
      }
    });
  });

  // Apply Discovery Modes and Ranking
  if (mode === 'same_institution') {
    users = users.filter(u => u.user_institution === currentUser.user_institution);
  } else if (mode === 'same_profession') {
    users = users.filter(u => u.user_industry === currentUser.user_industry);
  }

  const rankedUsers = users.map(u => {
    const compatibility = CompatibilityHelper.calculate(currentUser, u);
    let rankScore = 0;
    if (u.user_is_verified) rankScore += 1000;
    if (u.verificationTier === 'representative') rankScore += 500;
    rankScore += compatibility.score;
    rankScore += (u.profile_quality_score || 0) / 10;
    return { ...u, compatibility, rankScore };
  });

  return rankedUsers.sort((a, b) => b.rankScore - a.rankScore);
};
