import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ReportsApi = {
  reportUser: async (reportData: {
    reporterId: string,
    reporterName: string,
    offenderId: string,
    offenderName: string,
    offenderPhoto: string,
    category: string,
    reason: string
  }) => {
    await addDoc(collection(db, 'reports'), {
      ...reportData,
      status: 'pending',
      timestamp: serverTimestamp()
    });
  }
};
