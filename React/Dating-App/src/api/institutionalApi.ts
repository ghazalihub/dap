import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const VerificationApi = {
  submitVerification: async (user_id: string, data: {
    type: 'student' | 'professional',
    institution: string,
    file: File
  }) => {
    // 1. Upload Document
    const fileRef = ref(storage, `verifications/${user_id}/${Date.now()}.jpg`);
    await uploadBytes(fileRef, data.file);
    const fileUrl = await getDownloadURL(fileRef);

    // 2. Create Verification Entry
    await updateDoc(doc(db, 'users', user_id), {
      verification_status: 'pending',
      verificationType: data.type,
      user_institution: data.institution,
      verificationDocUrl: fileUrl
    });
  }
};

export const CommunityApi = {
  getCommunities: async () => {
    const snap = await getDocs(collection(db, 'communities'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  joinCommunity: async (user_id: string, communityId: string) => {
    await addDoc(collection(db, 'community_members'), {
      user_id,
      communityId,
      joinedAt: serverTimestamp()
    });
  }
};
