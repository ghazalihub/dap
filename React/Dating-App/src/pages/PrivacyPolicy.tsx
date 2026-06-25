import { Typography, Box, IconButton, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Privacy Policy</Typography>
      </header>
      <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
         <Typography variant="body2" className="text-gray-600 leading-relaxed">
            Your privacy is important to us. This policy explains how we collect and use your academic data...
            {/* Standard data collection boilerplate */}
         </Typography>
      </Paper>
    </div>
  );
};

export default PrivacyPolicy;
