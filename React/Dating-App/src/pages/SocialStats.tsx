import { useState, useEffect } from 'react';
import {
  Typography, Box, Grid, Card, CardMedia, CardContent,
  IconButton, CircularProgress, Tabs, Tab
} from '@mui/material';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../api/firebase';

const SocialStats = () => {
  const [activeTab, setActiveTab] = useState('likes');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      const collectionName = activeTab === 'likes' ? 'likes' : 'visits';
      const q = query(
        collection(db, collectionName),
        where(activeTab === 'likes' ? 'likedUserId' : 'visitedId', '==', auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      // In a real app, you would fetch user docs by IDs. Simplified here.
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Interactions</Typography>
      </header>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        fullWidth
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <Tab label="Who Liked You" value="likes" />
        <Tab label="Profile Visits" value="visits" />
      </Tabs>

      {loading ? (
        <Box className="flex justify-center p-20"><CircularProgress /></Box>
      ) : (
        <Grid container spacing={2}>
           {users.length > 0 ? users.map((u, i) => (
             <Grid item xs={6} key={i}>
                <Card className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative h-64">
                   <CardMedia
                     component="img"
                     image={u.photo || 'https://via.placeholder.com/300'}
                     className="h-full object-cover blur-[4px]" // Blur for non-VIP
                   />
                   <Box className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                      <Typography variant="subtitle2" className="text-white font-bold mb-4">Scholar {i+1}</Typography>
                      <button className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold">Unlock View</button>
                   </Box>
                </Card>
             </Grid>
           )) : (
             <Box className="w-full py-20 text-center text-gray-400 opacity-60">
                <CheckCircle className="text-4xl mb-2" />
                <Typography variant="body2">No new {activeTab} yet.</Typography>
             </Box>
           )}
        </Grid>
      )}
    </div>
  );
};

export default SocialStats;
