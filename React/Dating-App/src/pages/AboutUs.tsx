import {
  Typography, Box, Button,
  Paper, IconButton
} from '@mui/material';
import { ArrowBack, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">About Connect</Typography>
      </header>

      <Box className="text-center py-10">
         <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <School className="text-primary text-4xl" />
         </div>
         <Typography variant="h5" className="font-black text-primary italic mb-2">CONNECT</Typography>
         <Typography variant="caption" className="text-gray-400 uppercase font-bold tracking-widest">For Ambitious Minds</Typography>
      </Box>

      <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
         <section>
            <Typography variant="subtitle1" className="font-bold mb-2">Our Mission</Typography>
            <Typography variant="body2" className="text-gray-600 leading-relaxed">
               We believe that shared ambition and intellectual compatibility are the foundations of lasting relationships. Connect was built specifically for students and professionals in academic and research fields.
            </Typography>
         </section>

         <section>
            <Typography variant="subtitle1" className="font-bold mb-2">Community Trust</Typography>
            <Typography variant="body2" className="text-gray-600 leading-relaxed">
               Every profile on Connect goes through a manual verification process. We verify institutional IDs and professional licenses to ensure a high-trust environment for our members.
            </Typography>
         </section>
      </Paper>

      <div className="text-center space-y-4">
         <Typography variant="caption" className="block text-gray-400">Version 1.0.0 (Academic Edition)</Typography>
         <Button variant="text" size="small" color="primary">Terms of Service</Button>
         <Button variant="text" size="small" color="primary">Privacy Policy</Button>
      </div>
    </div>
  );
};

export default AboutUs;
