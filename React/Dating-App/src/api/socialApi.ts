import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const LikesApi = {
  likeUser: async (currentUserId: string, likedUserId: string) => {
    const q = query(
      collection(db, 'likes'),
      where('likedByUserId', '==', currentUserId),
      where('likedUserId', '==', likedUserId)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'likes'), {
        likedByUserId: currentUserId,
        likedUserId: likedUserId,
        timestamp: serverTimestamp()
      });
      return true;
    }
    return false;
  },

  checkMatch: async (currentUserId: string, otherUserId: string) => {
    const q = query(
      collection(db, 'likes'),
      where('likedByUserId', '==', otherUserId),
      where('likedUserId', '==', currentUserId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }
};

export const DislikesApi = {
  dislikeUser: async (currentUserId: string, dislikedUserId: string) => {
    await addDoc(collection(db, 'dislikes'), {
      dislikedByUserId: currentUserId,
      dislikedUserId: dislikedUserId,
      timestamp: serverTimestamp()
    });
  }
};

export const MatchesApi = {
  getMatches: async (userId: string) => {
    const q = query(
      collection(db, 'matches'),
      where('userIds', 'array-contains', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  createMatch: async (userIds: string[]) => {
    await addDoc(collection(db, 'matches'), {
      userIds,
      timestamp: serverTimestamp()
    });
  }
};

export const ConversationsApi = {
  getConversations: async (userId: string) => {
    const q = query(
      collection(db, 'conversations'),
      where('userIds', 'array-contains', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};

export const NotificationsApi = {
  getNotifications: async (userId: string) => {
    const q = query(
      collection(db, 'notifications'),
      where('receiverId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  sendNotification: async (data: any) => {
    await addDoc(collection(db, 'notifications'), {
      ...data,
      timestamp: serverTimestamp()
    });
  }
};
