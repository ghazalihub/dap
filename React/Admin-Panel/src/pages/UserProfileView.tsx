import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Avatar, Paper,
  Grid, Chip, Button, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  ArrowBack, School, Work, Verified,
  History, Report, Block, CheckCircle, Mail
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../api/firebase';
import type { User } from '../types/user';

const UserProfileView = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
       getDoc(doc(db, 'users', user_id)).then(s => {
          if (s.exists()) setUser(s.data() as User);
          setLoading(false);
       });
    }
  }, [user_id]);

  const handleStatusChange = async (status: string) => {
    if (!user_id) return;
    await updateDoc(doc(db, 'users', user_id), { user_status: status });
    alert(`Status updated to ${status}`);
    navigate('/users');
  };

  if (loading) return <Box className="p-10 text-center"><Typography>Loading Profile...</Typography></Box>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <div className="p-8 max-w-5xl space-y-8">
      <header className="flex items-center gap-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h4" className="font-bold">Member Details</Typography>
      </header>

      <Grid container spacing={4}>
         {/* Left Column: Basic Info */}
         <Grid item xs={12} md={4}>
            <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm text-center space-y-6">
               <Avatar src={user.user_profile_photo} className="w-32 h-32 mx-auto border-4 border-white shadow-xl" />
               <div>
                  <Typography variant="h5" className="font-bold">{user.user_fullname}</Typography>
                  <Typography variant="body2" className="text-gray-400">UID: {user.user_id}</Typography>
               </div>
               <Chip
                  label={user.user_status?.toUpperCase() || 'ACTIVE'}
                  color={user.user_status === 'active' ? 'success' : 'error'}
                  className="font-bold"
               />
               <Divider />
               <div className="flex justify-between text-left">
                  <div className="text-center flex-1">
                     <Typography variant="h6" className="font-bold">{user.user_total_likes || 0}</Typography>
                     <Typography variant="caption" className="text-gray-400 uppercase font-bold">Likes</Typography>
                  </div>
                  <Divider orientation="vertical" flexItem />
                  <div className="text-center flex-1">
                     <Typography variant="h6" className="font-bold">{user.user_total_visits || 0}</Typography>
                     <Typography variant="caption" className="text-gray-400 uppercase font-bold">Visits</Typography>
                  </div>
               </div>
            </Paper>
         </Grid>

         {/* Right Column: Academic & Professional Details */}
         <Grid item xs={12} md={8} className="space-y-6">
            <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm">
               <Typography variant="h6" className="font-bold mb-6 flex items-center gap-2">
                  <School className="text-primary" /> Academic Identity
               </Typography>
               <Grid container spacing={4}>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">Degree</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_degree}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">Institution</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_institution}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">University</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_university}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">Status</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_academic_status}</Typography>
                  </Grid>
               </Grid>
            </Paper>

            <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm">
               <Typography variant="h6" className="font-bold mb-6 flex items-center gap-2">
                  <Work className="text-blue-500" /> Professional Identity
               </Typography>
               <Grid container spacing={4}>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">Occupation</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_occupation}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                     <Typography variant="caption" className="font-black text-gray-400 uppercase">Industry</Typography>
                     <Typography variant="body1" className="font-medium">{user.user_industry}</Typography>
                  </Grid>
               </Grid>
            </Paper>

            {/* Moderation Controls */}
            <Box className="flex gap-4">
               <Button
                 variant="contained"
                 color="warning"
                 fullWidth
                 className="rounded-xl py-3 font-bold"
                 onClick={() => handleStatusChange('suspended')}
                 disabled={user.user_status === 'suspended'}
               >
                  Suspend User
               </Button>
               <Button
                 variant="contained"
                 color="error"
                 fullWidth
                 className="rounded-xl py-3 font-bold"
                 onClick={() => handleStatusChange('banned')}
                 disabled={user.user_status === 'banned'}
               >
                  Permanent Ban
               </Button>
               <Button
                 variant="outlined"
                 fullWidth
                 className="rounded-xl py-3 font-bold"
                 onClick={() => handleStatusChange('active')}
                 disabled={user.user_status === 'active'}
               >
                  Re-Activate
               </Button>
            </Box>
         </Grid>
      </Grid>
    </div>
  );
};

export default UserProfileView;
