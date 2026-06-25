import { useState, useEffect } from 'react';
import {
  Typography, TextField, Box, Button,
  List, ListItem, ListItemText, Paper,
  IconButton, InputAdornment
} from '@mui/material';
import { Search, LocationOn, TravelExplore, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { VipDialog } from '../components/VipDialog';

const Passport = () => {
  const [query, setQuery] = useState('');
  const [showVip, setShowVip] = useState(false);
  const { user, updateUser } = useUserStore();
  const navigate = useNavigate();

  const mockLocations = [
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Cambridge, UK', lat: 52.2053, lng: 0.1218 },
  ];

  const handleSelect = (loc: any) => {
    if (!user?.user_is_vip) {
       setShowVip(true);
       return;
    }
    updateUser({
      user_location: {
        latitude: loc.lat,
        longitude: loc.lng,
        address: loc.name
      }
    });
    alert(`Passport location set to ${loc.name}. Your discovery feed will now show matches in this area.`);
    navigate('/discover');
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="text-center py-6 bg-blue-500 rounded-3xl text-white shadow-lg">
         <TravelExplore className="text-4xl mb-2" />
         <Typography variant="h5" className="font-bold">Global Passport</Typography>
         <Typography variant="body2" className="opacity-90">Match with scholars anywhere in the world.</Typography>
      </header>

      <Paper className="p-4 rounded-3xl border border-gray-100 shadow-sm">
         <TextField
           fullWidth
           placeholder="Search city or university town..."
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <Search className="text-gray-300" />
               </InputAdornment>
             ),
             className: "rounded-full bg-gray-50 border-none"
           }}
         />
      </Paper>

      <Box className="space-y-4">
         <div className="flex items-center gap-2 text-gray-400 px-2">
            <History fontSize="small" />
            <Typography variant="caption" className="font-bold uppercase tracking-wider">Popular Academic Hubs</Typography>
         </div>

         <Paper className="rounded-3xl overflow-hidden border border-gray-100">
            <List className="p-0">
               {mockLocations.map((loc, i) => (
                 <ListItem key={i} button onClick={() => handleSelect(loc)} className="py-4">
                    <LocationOn className="mr-3 text-gray-300" />
                    <ListItemText primary={loc.name} />
                 </ListItem>
               ))}
            </List>
         </Paper>
      </Box>

      <Box className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
         <Typography variant="subtitle2" className="text-primary font-bold">Currently set to:</Typography>
         <Typography variant="body1" className="font-medium text-gray-800">{user?.user_location?.address || 'Current Location'}</Typography>
         <Button
            className="mt-4 text-primary font-bold"
            onClick={() => handleSelect({ name: 'Oxford, UK', lat: 51.7520, lng: -1.2577 })}
          >
            Reset to Oxford
         </Button>
      </Box>

      <VipDialog open={showVip} onClose={() => setShowVip(false)} />
    </div>
  );
};

export default Passport;
