import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export const VisitsApi = {
  trackVisit: async (visitorId: string, visitedId: string) => {
    if (visitorId === visitedId) return;
    await addDoc(collection(db, 'visits'), {
      visitorId,
      visitedId,
      timestamp: serverTimestamp()
    });
  },

  getVisits: async (user_id: string) => {
    const q = query(
      collection(db, 'visits'),
      where('visitedId', '==', user_id),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};
