import { useState, useEffect } from 'react';
import {
  Typography, Grid, Paper, Box,
  Button, TextField, IconButton, Avatar,
  Chip, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import {
  Add, Edit, Delete, Groups,
  School, Business, Science
} from '@mui/icons-material';
import { db } from '../api/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const CommunitiesManagement = () => {
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'communities'));
      setCommunities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
         <Typography variant="h4" className="font-bold text-gray-800">Academic Communities</Typography>
         <Button variant="contained" color="primary" startIcon={<Add />}>Create Community</Button>
      </Box>

      <Grid container spacing={4}>
         {communities.map((c, i) => (
           <Grid item xs={12} md={6} lg={4} key={i}>
              <Paper className="p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                 <Box className="flex items-center gap-4 mb-4">
                    <Avatar className="bg-primary/10 text-primary">
                       <School />
                    </Avatar>
                    <div>
                       <Typography variant="h6" className="font-bold">{c.name}</Typography>
                       <Typography variant="caption" className="text-gray-400 uppercase font-bold">{c.memberCount || 0} Members</Typography>
                    </div>
                 </Box>
                 <Typography variant="body2" className="text-gray-600 mb-6 line-clamp-2">
                    {c.description || 'Specialized group for research and networking in this academic field.'}
                 </Typography>
                 <div className="flex gap-2">
                    <Button variant="outlined" size="small" startIcon={<Edit />}>Edit</Button>
                    <Button variant="outlined" color="error" size="small" startIcon={<Delete />}>Delete</Button>
                 </div>
              </Paper>
           </Grid>
         ))}
         {communities.length === 0 && (
           <Box className="w-full py-20 text-center opacity-30">
              <Groups className="text-6xl mb-2" />
              <Typography>No communities created yet.</Typography>
           </Box>
         )}
      </Grid>
    </div>
  );
};

export default CommunitiesManagement;
