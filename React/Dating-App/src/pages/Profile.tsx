import { useState } from 'react';
import {
  Typography, Avatar, Box, List, ListItem,
  ListItemIcon, ListItemText, Divider, Switch,
  Button, Paper, Grid
} from '@mui/material';
import {
  Settings, Verified, Payment, Security,
  Help, Info, ExitToApp, ChevronRight
} from '@mui/icons-material';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const stats = [
    { label: 'Likes', count: user?.userTotalLikes || 0 },
    { label: 'Visits', count: user?.userTotalVisits || 0 },
    { label: 'Matches', count: 12 },
  ];

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      {/* Header */}
      <Box className="flex flex-col items-center py-6">
        <div className="relative">
           <Avatar
             src={user?.user_profile_photo}
             className="w-24 h-24 border-4 border-white shadow-md"
           />
           {user?.user_is_verified && (
             <Verified className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full" />
           )}
        </div>
        <Typography variant="h6" className="font-bold mt-4">{user?.user_fullname}</Typography>
        <Typography variant="body2" className="text-gray-500">{user?.user_degree} • {user?.user_university}</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2}>
        {stats.map(s => (
          <Grid item xs={4} key={s.label}>
             <Paper className="p-3 text-center rounded-2xl border border-gray-100 shadow-sm">
                <Typography variant="h6" className="font-bold text-primary">{s.count}</Typography>
                <Typography variant="caption" className="text-gray-400 font-bold uppercase">{s.label}</Typography>
             </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Actions */}
      <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
         <List className="p-0">
            <ListItem button onClick={() => navigate('/premium')} className="py-4">
               <ListItemIcon><Payment color="primary"/></ListItemIcon>
               <ListItemText primary="Premium Subscription" secondary="Unlock all academic filters" />
               <ChevronRight className="text-gray-300" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => navigate('/onboarding')} className="py-4">
               <ListItemIcon><Settings /></ListItemIcon>
               <ListItemText primary="Edit Profile" secondary="Update your academic info" />
               <ChevronRight className="text-gray-300" />
            </ListItem>
            <Divider />
            <ListItem className="py-4">
               <ListItemIcon><Security /></ListItemIcon>
               <ListItemText primary="Ghost Mode" secondary="Hide profile from discovery" />
               <Switch color="primary" />
            </ListItem>
         </List>
      </Paper>

      <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
         <List className="p-0">
            <ListItem button className="py-3">
               <ListItemIcon><Help /></ListItemIcon>
               <ListItemText primary="Help & Support" />
            </ListItem>
            <Divider />
            <ListItem button className="py-3">
               <ListItemIcon><Info /></ListItemIcon>
               <ListItemText primary="About Academic Connect" />
            </ListItem>
         </List>
      </Paper>

      <Button
        fullWidth
        variant="outlined"
        color="error"
        className="rounded-full py-3 border-red-200"
        startIcon={<ExitToApp />}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;
