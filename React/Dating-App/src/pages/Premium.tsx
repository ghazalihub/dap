import {
  Typography, Card, CardContent, Button,
  Box, List, ListItem, ListItemIcon, ListItemText, Paper
} from '@mui/material';
import { CheckCircle, Star, AllInclusive, FlashOn, Public } from '@mui/icons-material';
import { useUserStore } from '../store/userStore';

const Premium = () => {
  const { user } = useUserStore();

  const plans = [
    { name: '1 Month', price: '$14.99', desc: 'Perfect for exam season' },
    { name: '6 Months', price: '$59.99', desc: 'Best for networking', featured: true },
    { name: '12 Months', price: '$89.99', desc: 'Master Scholar level' },
  ];

  const features = [
    { icon: <AllInclusive color="primary" />, text: 'Unlimited Likes' },
    { icon: <FlashOn sx={{ color: '#ff9800' }} />, text: 'Profile Boost (2x visibility)' },
    { icon: <Public color="secondary" />, text: 'Passport: Match with scholars globally' },
    { icon: <Star color="primary" />, text: 'Premium Badge on Profile' },
    { icon: <CheckCircle sx={{ color: '#4caf50' }} />, text: 'See who liked you' },
  ];

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8 pb-20">
      <Box className="text-center py-10 bg-gradient-to-br from-primary to-pink-400 rounded-3xl text-white shadow-lg">
         <Star className="text-yellow-300 text-4xl mb-2" />
         <Typography variant="h5" className="font-bold">Connect Premium</Typography>
         <Typography variant="body2" className="opacity-90">Accelerate your search for an ambitious partner</Typography>
      </Box>

      <div className="grid grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.name}>
             <Card
               className={`h-full rounded-2xl transition-all border-2 ${p.featured ? 'border-primary ring-1 ring-primary' : 'border-gray-100'}`}
             >
                <CardContent className="text-center p-3">
                   <Typography variant="caption" className="font-bold text-gray-500 uppercase">{p.name}</Typography>
                   <Typography variant="h6" className="font-bold text-primary">{p.price}</Typography>
                   <Typography variant="caption" className="text-[10px] text-gray-400 block mt-1 leading-tight">{p.desc}</Typography>
                </CardContent>
             </Card>
          </div>
        ))}
      </div>

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

      <Box className="space-y-4">
         <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className="rounded-full py-3 font-bold"
          >
            Upgrade Now
         </Button>
         <Typography variant="caption" className="text-center block text-gray-400 px-6">
            Subscription will renew automatically. Cancel anytime in your account settings.
         </Typography>
      </Box>

      {user?.userIsVerified && (
        <Box className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
           <Typography variant="subtitle2" className="text-blue-700 font-bold">Verified Discount</Typography>
           <Typography variant="caption" className="text-blue-600 block mb-3">Since you are a verified scholar, you get 20% off all plans.</Typography>
        </Box>
      )}
    </div>
  );
};

export default Premium;
