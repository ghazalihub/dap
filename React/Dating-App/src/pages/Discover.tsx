import { useState, useEffect } from 'react';
import { fetchDiscoveryUsers } from '../api/discoveryApi';
import type { User } from '../types/user';
import {
  Typography, IconButton,
  Box, Chip, Tabs, Tab, CircularProgress, Paper
} from '@mui/material';
import {
  CheckCircle, School, Work, Star,
  Close, Favorite, FlashOn
} from '@mui/icons-material';
import { auth, db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LikesApi, DislikesApi } from '../api/socialApi';
import { MatchDialog } from '../components/MatchDialog';
import { useUserStore } from '../store/userStore';
import { VipDialog } from '../components/VipDialog';

const Discover = () => {
  const { user: currentUser } = useUserStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('standard');
  const [showMatch, setShowMatch] = useState(false);
  const [showVip, setShowVip] = useState(false);
  const [matchUser, setMatchUser] = useState<User | null>(null);

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

  const handleSwipe = async (user_id: string, direction: 'left' | 'right') => {
    if (!currentUser) return;

    if (!currentUser.user_is_vip && mode !== 'standard') {
       setShowVip(true);
       return;
    }

    if (direction === 'right') {
       const isMatch = await LikesApi.likeUser(currentUser.user_id, user_id);
       if (isMatch) {
          const mUser = users.find(u => u.user_id === user_id);
          setMatchUser(mUser);
          setShowMatch(true);
       }
    } else {
       await DislikesApi.dislikeUser(currentUser.user_id, user_id);
    }
    setUsers(prev => prev.filter(u => u.user_id !== user_id));
  };

  if (loading) return <Box className="flex justify-center p-10"><CircularProgress /></Box>;
  if (!currentUser) return <Typography>Please sign in</Typography>;

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
      <header className="flex justify-between items-center mb-4">
         <Typography variant="h5" className="font-black text-primary italic">CONNECT</Typography>
         <IconButton className="bg-primary/10 text-primary"><FlashOn fontSize="small" /></IconButton>
      </header>

      <Tabs
        value={mode}
        onChange={(_, v) => setMode(v)}
        variant="scrollable"
        scrollButtons="auto"
        className="mb-6"
      >
        <Tab label="Discover" value="standard" />
        <Tab label="Institution" value="same_institution" />
        <Tab label="Industry" value="same_profession" />
      </Tabs>

      <div className="relative flex-1">
        <AnimatePresence>
          {users.length > 0 ? (
            users.slice(0, 2).reverse().map((user, index) => (
              <SwipeCard
                key={user.user_id}
                user={user}
                isTop={index === (users.length > 1 ? 1 : 0)}
                onSwipe={(dir) => handleSwipe(user.user_id, dir)}
              />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
               <Typography variant="h6" className="font-bold mb-2">No more scholars found</Typography>
               <Typography variant="body2">Try expanding your radius or changing discovery modes.</Typography>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-8 py-6">
          <IconButton
            onClick={() => users[0] && handleSwipe(users[0].user_id, 'left')}
            className="w-16 h-16 bg-white shadow-xl text-red-500 border border-gray-100"
          >
             <Close fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => users[0] && handleSwipe(users[0].user_id, 'right')}
            className="w-16 h-16 bg-white shadow-xl text-green-500 border border-gray-100"
          >
             <Favorite fontSize="large" />
          </IconButton>
      </div>

      {matchUser && (
        <MatchDialog
          open={showMatch}
          onClose={() => setShowMatch(false)}
          matchUser={matchUser}
          currentUser={currentUser}
        />
      )}

      <VipDialog open={showVip} onClose={() => setShowVip(false)} />
    </div>
  );
};

const SwipeCard = ({ user, onSwipe, isTop }: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, position: 'absolute', inset: 0, zIndex: isTop ? 10 : 5 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Paper className="h-full rounded-[2rem] overflow-hidden shadow-2xl relative border border-gray-100 bg-white">
         <img src={user.user_profile_photo} className="w-full h-full object-cover" />

         <motion.div
           style={{ opacity: likeOpacity }}
           className="absolute top-10 left-10 border-4 border-green-500 rounded-xl px-4 py-1 rotate-[-20deg] z-20 pointer-events-none"
         >
            <Typography variant="h4" className="font-black text-green-500">LIKE</Typography>
         </motion.div>

         <motion.div
           style={{ opacity: nopeOpacity }}
           className="absolute top-10 right-10 border-4 border-red-500 rounded-xl px-4 py-1 rotate-[20deg] z-20 pointer-events-none"
         >
            <Typography variant="h4" className="font-black text-red-500">NOPE</Typography>
         </motion.div>

         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

         <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Box className="flex justify-between items-end mb-2">
               <div>
                  <Typography variant="h4" className="font-bold flex items-center gap-2">
                    {user.user_fullname}
                    {user.user_is_verified && <CheckCircle className="text-blue-400" />}
                  </Typography>
                  <Typography variant="subtitle1" className="opacity-80">{user.user_degree} @ {user.user_university}</Typography>
               </div>
               <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                  <Typography variant="caption" className="font-black text-white">{user.compatibility?.score}%</Typography>
               </div>
            </Box>

            <div className="flex flex-wrap gap-2 mb-4">
                <Chip label={user.user_institution} size="small" className="bg-white/10 text-white border-white/20" variant="outlined" />
                <Chip label={user.user_occupation} size="small" className="bg-white/10 text-white border-white/20" variant="outlined" />
            </div>

            <div className="space-y-1">
               {user.compatibility?.explanations?.slice(0, 1).map((exp: string, i: number) => (
                  <Typography key={i} variant="caption" className="flex items-center gap-1 text-green-300 font-medium">
                     <Star fontSize="inherit" /> {exp}
                  </Typography>
               ))}
            </div>
         </div>
      </Paper>
    </motion.div>
  );
};

export default Discover;
