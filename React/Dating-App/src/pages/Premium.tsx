import {
  Typography, Box, List, ListItem, ListItemIcon, ListItemText, Paper, Button
} from '@mui/material';
import { CheckCircle, Star, AllInclusive, FlashOn, Public, Close } from '@mui/icons-material';
import { useUserStore } from '../store/userStore';
import { StoreProducts } from '../components/StoreProducts';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
  const { user, updateUser } = useUserStore();
  const navigate = useNavigate();

  const handlePurchase = (id: string) => {
    // Mock purchase logic
    updateUser({ userIsVerified: true }); // Simplified for clone
    alert(`Purchase of ${id} successful! You are now a VIP member.`);
    navigate('/profile');
  };

  const features = [
    { icon: <AllInclusive color="primary" />, text: 'Unlimited Likes' },
    { icon: <FlashOn sx={{ color: '#ff9800' }} />, text: 'Profile Boost (2x visibility)' },
    { icon: <Public color="secondary" />, text: 'Passport: Match with scholars globally' },
    { icon: <Star color="primary" />, text: 'Premium Badge on Profile' },
    { icon: <CheckCircle sx={{ color: '#4caf50' }} />, text: 'See who liked you' },
  ];

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8 pb-20 relative">
      <Button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white min-w-0 p-2 rounded-full z-10"
      >
        <Close />
      </Button>

      <Box className="text-center pt-12 pb-10 bg-gradient-to-br from-primary to-pink-400 rounded-3xl text-white shadow-lg relative overflow-hidden">
         <Star className="text-yellow-300 text-6xl mb-2 opacity-50 absolute -top-4 -left-4 rotate-12" />
         <Star className="text-yellow-300 text-4xl mb-2" />
         <Typography variant="h4" className="font-black italic">CONNECT VIP</Typography>
         <Typography variant="body2" className="opacity-90">Accelerate your search for an ambitious partner</Typography>
      </Box>

      <StoreProducts onPurchase={handlePurchase} />

      <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm">
         <Typography variant="subtitle1" className="font-bold mb-4">Scholar Benefits</Typography>
         <List className="p-0 space-y-1">
            {features.map((f, i) => (
              <ListItem key={i} className="px-0">
                 <ListItemIcon className="min-w-[40px]">{f.icon}</ListItemIcon>
                 <ListItemText primary={<Typography variant="body2" className="font-medium">{f.text}</Typography>} />
              </ListItem>
            ))}
         </List>
      </Paper>

      {user?.userIsVerified && (
        <Box className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
           <Typography variant="subtitle2" className="text-blue-700 font-bold">Verified Scholar Discount</Typography>
           <Typography variant="caption" className="text-blue-600 block mb-3">Since you are a verified scholar, you get 20% off all plans.</Typography>
        </Box>
      )}

      <Box className="text-center px-6">
         <Typography variant="caption" className="text-gray-400">
            By upgrading, you agree to our Terms of Service and Privacy Policy. Subscriptions automatically renew.
         </Typography>
      </Box>
    </div>
  );
};

export default Premium;
