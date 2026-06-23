import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../api/firebase';
import { CompatibilityHelper } from '../utils/compatibilityHelper';
import type { User } from '../types/user';

export const fetchDiscoveryUsers = async (currentUser: User, mode: string = 'standard') => {
  const usersRef = collection(db, 'users');
  let q;

  // Basic filters: Opposite gender, Active status
  const oppositeGender = currentUser.userGender === 'Male' ? 'Female' : 'Male';

  // Note: Firestore doesn't support complex in-memory ranking natively.
  // We fetch a batch and then apply our tiered ranking logic.
  q = query(
    usersRef,
    where('userGender', '==', oppositeGender),
    where('userStatus', '==', 'active'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  let users = snapshot.docs
    .map(doc => doc.data() as User)
    .filter(u => u.userId !== currentUser.userId);

  // Apply Discovery Modes
  if (mode === 'same_institution') {
    users = users.filter(u => u.userInstitution === currentUser.userInstitution);
  } else if (mode === 'same_profession') {
    users = users.filter(u => u.userIndustry === currentUser.userIndustry);
  }

  // Tiered Ranking Logic:
  // 1. Verification Status (Primary)
  // 2. Compatibility Score (Secondary)
  // 3. Profile Quality Score (Tertiary)
  // 4. Recency (Quaternary)

  const rankedUsers = users.map(u => {
    const compatibility = CompatibilityHelper.calculate(currentUser, u);

    // Calculate Rank Score
    let rankScore = 0;
    if (u.userIsVerified) rankScore += 1000;
    if (u.verificationTier === 'representative') rankScore += 500;
    rankScore += compatibility.score;
    rankScore += (u.profileQualityScore || 0) / 10;

    return { ...u, compatibility, rankScore };
  });

  return rankedUsers.sort((a, b) => b.rankScore - a.rankScore);
};
