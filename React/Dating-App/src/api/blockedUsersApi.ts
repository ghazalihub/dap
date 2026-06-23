import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const BlockedUsersApi = {
  blockUser: async (currentUserId: string, blockedUserId: string, restrictedOnly: boolean = false) => {
    const q = query(
      collection(db, 'blocked_users'),
      where('blockedByUserId', '==', currentUserId),
      where('blockedUserId', '==', blockedUserId)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'blocked_users'), {
        blockedByUserId: currentUserId,
        blockedUserId: blockedUserId,
        restrictedOnly,
        timestamp: serverTimestamp()
      });
      return true;
    }
    return false;
  },

  isBlocked: async (currentUserId: string, otherUserId: string) => {
    const q = query(
      collection(db, 'blocked_users'),
      where('blockedByUserId', '==', currentUserId),
      where('blockedUserId', '==', otherUserId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  },

  unblockUser: async (currentUserId: string, blockedUserId: string) => {
    const q = query(
      collection(db, 'blocked_users'),
      where('blockedByUserId', '==', currentUserId),
      where('blockedUserId', '==', blockedUserId)
    );
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'blocked_users', d.id));
    }
  }
};
