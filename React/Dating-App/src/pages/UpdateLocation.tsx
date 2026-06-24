import { useState } from 'react';
import {
  Typography, Box, Button,
  Paper, IconButton, TextField
} from '@mui/material';
import { ArrowBack, MyLocation, Map } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const UpdateLocation = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const [address, setAddress] = useState(user?.user_location?.address || '');

  const handleUpdate = () => {
    updateUser({
      user_location: {
        ...user?.user_location,
        address: address,
        latitude: user?.user_location?.latitude || 0,
        longitude: user?.user_location?.longitude || 0
      }
    });
    alert("Location updated successfully!");
    navigate(-1);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        updateUser({
          user_location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: "Detected GPS Location"
          }
        });
        setAddress("Detected GPS Location");
        alert("GPS Location detected!");
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Update Location</Typography>
      </header>

      <Box className="text-center py-8">
         <Map className="text-primary text-6xl opacity-20 mb-4" />
         <Typography variant="body2" className="text-gray-500 px-10">
            Your location is used to find scholars nearby. You can update it manually or use your GPS.
         </Typography>
      </Box>

      <Paper className="p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
         <TextField
           fullWidth
           label="Your City / Address"
           value={address}
           onChange={(e) => setAddress(e.target.value)}
           variant="outlined"
           className="bg-gray-50 rounded-2xl"
         />

         <Button
            fullWidth
            variant="outlined"
            startIcon={<MyLocation />}
            className="rounded-full py-3 border-gray-200 text-gray-600"
            onClick={handleCurrentLocation}
         >
            Use My Current GPS
         </Button>

         <Button
            fullWidth
            variant="contained"
            color="primary"
            className="rounded-full py-4 font-bold shadow-lg shadow-primary/20"
            onClick={handleUpdate}
         >
            Save Location
         </Button>
      </Paper>
    </div>
  );
};

export default UpdateLocation;
