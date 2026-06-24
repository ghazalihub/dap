import { useState } from 'react';
import {
  Typography, Box, List, ListItem,
  ListItemIcon, ListItemText, Divider, Switch,
  Paper, IconButton, Slider, Button
} from '@mui/material';
import {
  ArrowBack, Notifications, Visibility,
  LocationOn, Gavel, DeleteForever, Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState(50);
  const [ageRange, setAgeRange] = useState([18, 35]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Settings</Typography>
      </header>

      <Box className="space-y-2">
         <Typography variant="caption" className="font-bold text-gray-400 uppercase tracking-widest px-2">Discovery Settings</Typography>
         <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
               <div className="flex justify-between items-center mb-4">
                  <Typography variant="body2" className="font-bold">Maximum Distance</Typography>
                  <Typography variant="body2" className="text-primary font-bold">{distance} km</Typography>
               </div>
               <Slider
                 value={distance}
                 onChange={(_, v) => setDistance(v as number)}
                 min={1}
                 max={200}
                 color="primary"
               />
            </div>

            <Divider />

            <div>
               <div className="flex justify-between items-center mb-4">
                  <Typography variant="body2" className="font-bold">Age Range</Typography>
                  <Typography variant="body2" className="text-primary font-bold">{ageRange[0]} - {ageRange[1]}</Typography>
               </div>
               <Slider
                 value={ageRange}
                 onChange={(_, v) => setAgeRange(v as number[])}
                 min={18}
                 max={100}
                 color="primary"
               />
            </div>
         </Paper>
      </Box>

      <Box className="space-y-2">
         <Typography variant="caption" className="font-bold text-gray-400 uppercase tracking-widest px-2">Privacy & Security</Typography>
         <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <List className="p-0">
               <ListItem className="py-4">
                  <ListItemIcon><Visibility /></ListItemIcon>
                  <ListItemText primary="Show Me on Connect" />
                  <Switch defaultChecked color="primary" />
               </ListItem>
               <Divider />
               <ListItem button className="py-4">
                  <ListItemIcon><LocationOn /></ListItemIcon>
                  <ListItemText primary="Update Location" />
               </ListItem>
            </List>
         </Paper>
      </Box>

      <Box className="space-y-2">
         <Typography variant="caption" className="font-bold text-gray-400 uppercase tracking-widest px-2">Account Actions</Typography>
         <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <List className="p-0">
               <ListItem button className="py-4">
                  <ListItemIcon><Notifications /></ListItemIcon>
                  <ListItemText primary="Push Notifications" />
               </ListItem>
               <Divider />
               <ListItem button className="py-4">
                  <ListItemIcon><Gavel /></ListItemIcon>
                  <ListItemText primary="Privacy Policy" />
               </ListItem>
               <Divider />
               <ListItem button className="py-4 text-red-500">
                  <ListItemIcon><DeleteForever className="text-red-500" /></ListItemIcon>
                  <ListItemText primary="Delete Account" />
               </ListItem>
            </List>
         </Paper>
      </Box>

      <div className="text-center py-6 opacity-40">
         <Typography variant="caption">Connect for Scholars v1.0.0 (Build 12)</Typography>
      </div>
    </div>
  );
};

export default Settings;
