import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';

export const MessagesApi = {
  getMessages: (conversationId: string) => {
    return query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
  },

  saveMessage: async (data: {
    type: 'text' | 'image',
    senderId: string,
    receiverId: string,
    text: string,
    imgLink?: string,
    conversationId: string
  }) => {
    await addDoc(collection(db, 'messages'), {
      ...data,
      timestamp: serverTimestamp()
    });
  },

  deleteChat: async (conversationId: string) => {
    const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'messages', d.id));
    }
  }
};
