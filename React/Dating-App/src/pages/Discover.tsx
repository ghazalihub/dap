import { useState, useEffect } from 'react';
import { fetchDiscoveryUsers } from '../api/discoveryApi';
import type { User } from '../types/user';
import {
  Card, CardContent, Typography, CardMedia, Button,
  Box, Chip, Tabs, Tab, CircularProgress
} from '@mui/material';
import { CheckCircle, School, Work, Star } from '@mui/icons-material';
import { auth, db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Discover = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('standard');

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const uData = userDoc.data() as User;
        setCurrentUser(uData);
        const discovered = await fetchDiscoveryUsers(uData, mode);
        setUsers(discovered);
      }
      setLoading(false);
    };
    loadData();
  }, [mode]);

  if (loading) return <Box className="flex justify-center p-10"><CircularProgress /></Box>;
  if (!currentUser) return <Typography>Please sign in</Typography>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 pb-20">
      <Typography variant="h5" className="font-bold text-primary">Discover</Typography>

      <Tabs
        value={mode}
        onChange={(_, v) => setMode(v)}
        variant="scrollable"
        scrollButtons="auto"
        className="mb-4"
      >
        <Tab label="All" value="standard" />
        <Tab label="Same Institution" value="same_institution" />
        <Tab label="Same Profession" value="same_profession" />
        <Tab label="Highly Compatible" value="compatible" />
      </Tabs>

      {!currentUser.userIsVerified && (
        <Box className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-4">
          <Typography variant="body2" className="text-yellow-800">
            Verify your academic profile to unlock likes and be seen by others.
          </Typography>
        </Box>
      )}

      <div className="space-y-6">
        {users.map(user => (
          <Card key={user.userId} className="rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <CardMedia
              component="img"
              height="400"
              image={user.userProfilePhoto || 'https://via.placeholder.com/400'}
              className="h-[400px] object-cover"
            />
            <CardContent className="space-y-3">
              <Box className="flex justify-between items-start">
                <div>
                  <Typography variant="h6" className="font-bold flex items-center gap-1">
                    {user.userFullname}
                    {user.userIsVerified && <CheckCircle className="text-blue-500" fontSize="small" />}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">{user.userDegree} @ {user.userUniversity}</Typography>
                </div>
                <Box className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  <Typography variant="caption" className="text-primary font-bold">
                    {user.compatibility?.score}% Compatible
                  </Typography>
                </Box>
              </Box>

              <div className="flex flex-wrap gap-2">
                <Chip icon={<School fontSize="small" />} label={user.userInstitution} size="small" variant="outlined" />
                <Chip icon={<Work fontSize="small" />} label={user.userOccupation} size="small" variant="outlined" />
              </div>

              {user.compatibility?.explanations?.slice(0, 2).map((exp: string, i: number) => (
                <Typography key={i} variant="caption" className="flex items-center gap-1 text-green-700">
                  <Star fontSize="inherit" /> {exp}
                </Typography>
              ))}

              <div className="flex gap-4 mt-4">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!currentUser.userIsVerified}
                  className="rounded-xl py-2"
                >
                  Like
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  className="rounded-xl py-2"
                >
                  Pass
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && <Typography className="text-center py-10 text-gray-400">No matches found in this category.</Typography>}
      </div>
    </div>
  );
};

export default Discover;
