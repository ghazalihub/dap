import {
  Dialog, DialogTitle, DialogContent,
  Typography, List, ListItem, ListItemIcon,
  ListItemText, Button, Box
} from '@mui/material';
import { Star, CheckCircle, FlashOn, Public, AllInclusive } from '@mui/icons-material';

interface VipDialogProps {
  open: boolean;
  onClose: () => void;
}

export const VipDialog = ({ open, onClose }: VipDialogProps) => {
  const benefits = [
    { icon: <AllInclusive color="primary" />, text: 'Unlimited Likes' },
    { icon: <FlashOn sx={{ color: '#ff9800' }} />, text: 'Profile Boost' },
    { icon: <Public color="secondary" />, text: 'Global Passport' },
    { icon: <CheckCircle sx={{ color: '#4caf50' }} />, text: 'See Who Liked You' },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="text-center pt-8">
         <Star className="text-yellow-400 text-5xl mb-2" />
         <Typography variant="h5" className="font-bold">Go Connect VIP</Typography>
      </DialogTitle>
      <DialogContent>
         <Typography variant="body2" className="text-center text-gray-500 mb-6 px-4">
            Get exclusive features to find your ideal academic partner faster.
         </Typography>
         <List>
            {benefits.map((b, i) => (
              <ListItem key={i}>
                 <ListItemIcon>{b.icon}</ListItemIcon>
                 <ListItemText primary={b.text} />
              </ListItem>
            ))}
         </List>
         <Box className="mt-8 space-y-3">
            <Button fullWidth variant="contained" color="primary" className="rounded-full py-3">View Plans</Button>
            <Button fullWidth onClick={onClose} className="text-gray-400">Maybe Later</Button>
         </Box>
      </DialogContent>
    </Dialog>
  );
};
