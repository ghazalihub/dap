import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Avatar, Paper,
  IconButton, Chip, Grid, Button, CircularProgress
} from '@mui/material';
import {
  ArrowBack, Verified, School, Work,
  AutoAwesome, Star, Favorite, Close
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import type { User } from '../types/user';
import { CompatibilityHelper } from '../utils/compatibilityHelper';
import { useUserStore } from '../store/userStore';
import { Gallery } from '../components/Gallery';

const ProfileDetail = () => {
  const { user_id } = useParams();
  const { user: currentUser } = useUserStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) return;
    getDoc(doc(db, 'users', user_id)).then(s => {
      if (s.exists()) setProfile(s.data() as User);
      setLoading(false);
    });
  }, [user_id]);

  if (loading) return <Box className="flex justify-center p-20"><CircularProgress /></Box>;
  if (!profile || !currentUser) return <Typography>Profile not found</Typography>;

  const compatibility = CompatibilityHelper.calculate(currentUser, profile);

  return (
    <div className="max-w-xl mx-auto pb-24">
      {/* Cover/Avatar */}
      <div className="relative">
         <Gallery images={[profile.user_profile_photo, ...(profile.user_gallery || [])]} />
         <div className="absolute top-4 left-4 z-20">
            <IconButton onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur text-white shadow-lg">
               <ArrowBack />
            </IconButton>
         </div>
         <div className="absolute -bottom-6 right-8">
            <div className="bg-white p-4 rounded-full shadow-2xl border-4 border-primary/20">
               <Typography variant="h6" className="font-black text-primary leading-none text-center">
                  {compatibility.score}%
               </Typography>
               <Typography variant="caption" className="text-gray-400 font-bold uppercase text-[8px]">Match</Typography>
            </div>
         </div>
      </div>

      <div className="p-6 pt-10 space-y-8">
         <header>
            <div className="flex items-center gap-2 mb-1">
               <Typography variant="h4" className="font-bold">{profile.user_fullname}</Typography>
               {profile.user_is_verified && <Verified className="text-blue-500" />}
            </div>
            <Typography variant="body1" className="text-gray-500 font-medium">
               {profile.user_degree} @ {profile.user_university}
            </Typography>
         </header>

         {/* Compatibility Explanation */}
         <Box className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
            <div className="flex items-center gap-2 mb-4">
               <AutoAwesome className="text-primary" />
               <Typography variant="subtitle1" className="font-black text-primary">Compatibility Analysis</Typography>
            </div>
            <div className="space-y-3">
               {compatibility.explanations.map((exp, i) => (
                 <div key={i} className="flex gap-3">
                    <Star className="text-yellow-500 text-sm mt-1" />
                    <Typography variant="body2" className="text-gray-700">{exp}</Typography>
                 </div>
               ))}
            </div>
         </Box>

         {/* Info Sections */}
         <div className="space-y-6">
            <section className="space-y-3">
               <Typography variant="caption" className="font-black text-gray-400 uppercase tracking-widest">Academic Details</Typography>
               <Paper className="p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><School /></div>
                  <div>
                     <Typography variant="subtitle2" className="font-bold">{profile.user_institution}</Typography>
                     <Typography variant="caption" className="text-gray-500">{profile.user_academic_status}</Typography>
                  </div>
               </Paper>
            </section>

            <section className="space-y-3">
               <Typography variant="caption" className="font-black text-gray-400 uppercase tracking-widest">Professional Identity</Typography>
               <Paper className="p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><Work /></div>
                  <div>
                     <Typography variant="subtitle2" className="font-bold">{profile.user_occupation}</Typography>
                     <Typography variant="caption" className="text-gray-500">{profile.user_industry}</Typography>
                  </div>
               </Paper>
            </section>

            <section className="space-y-3">
               <Typography variant="caption" className="font-black text-gray-400 uppercase tracking-widest">About Me</Typography>
               <Typography variant="body1" className="text-gray-600 leading-relaxed italic">
                  "{profile.user_bio || 'No bio provided.'}"
               </Typography>
            </section>

            <section className="space-y-3">
               <Typography variant="caption" className="font-black text-gray-400 uppercase tracking-widest">Research & Goals</Typography>
               <div className="flex flex-wrap gap-2">
                  {profile.user_research_interests?.map(i => <Chip key={i} label={i} variant="outlined" className="rounded-xl" />)}
                  {profile.user_future_goals?.map(i => <Chip key={i} label={i} color="primary" variant="outlined" className="rounded-xl" />)}
               </div>
            </section>
         </div>

         {/* Action Bar */}
         <div className="flex gap-4 sticky bottom-6 z-20">
             <Button
               fullWidth
               variant="contained"
               className="bg-white text-red-500 hover:bg-red-50 rounded-full py-4 shadow-xl border border-red-50 font-bold"
               startIcon={<Close />}
               onClick={() => navigate(-1)}
             >
                Pass
             </Button>
             <Button
               fullWidth
               variant="contained"
               color="primary"
               className="rounded-full py-4 shadow-xl shadow-primary/20 font-bold"
               startIcon={<Favorite />}
             >
                Like Profile
             </Button>
         </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
