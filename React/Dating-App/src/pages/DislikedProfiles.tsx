import { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Card, CardMedia, CardContent,
  IconButton, CircularProgress, Paper
} from '@mui/material';
import { ArrowBack, DeleteOutline, SentimentDissatisfied } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../api/firebase';

const DislikedProfiles = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, 'dislikes'),
        where('dislikedByUserId', '==', auth.currentUser.uid)
      );
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUndo = async (dislikeId: string) => {
    await deleteDoc(doc(db, 'dislikes', dislikeId));
    setUsers(prev => prev.filter(u => u.id !== dislikeId));
    alert("Profile returned to discovery!");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Pass History</Typography>
      </header>

      {loading ? (
        <Box className="flex justify-center p-20"><CircularProgress /></Box>
      ) : (
        <div className="space-y-4">
           {users.length > 0 ? users.map((u, i) => (
             <Paper key={i} className="p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <CardMedia
                  component="img"
                  image={u.photo || 'https://via.placeholder.com/100'}
                  className="w-16 h-16 rounded-2xl object-cover grayscale"
                />
                <div className="flex-1">
                   <Typography variant="subtitle2" className="font-bold">Scholar Profile</Typography>
                   <Typography variant="caption" className="text-gray-400">Passed on {new Date(u.timestamp?.seconds * 1000).toLocaleDateString()}</Typography>
                </div>
                <IconButton color="primary" onClick={() => handleUndo(u.id)} className="bg-primary/5">
                   <DeleteOutline />
                </IconButton>
             </Paper>
           )) : (
             <Box className="py-20 text-center opacity-40">
                <SentimentDissatisfied className="text-5xl mb-2" />
                <Typography variant="body2">Your pass history is empty.</Typography>
             </Box>
           )}
        </div>
      )}
    </div>
  );
};

export default DislikedProfiles;
