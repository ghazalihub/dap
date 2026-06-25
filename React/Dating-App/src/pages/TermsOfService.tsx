import { Typography, Box, IconButton, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Terms of Service</Typography>
      </header>
      <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
         <Typography variant="body2" className="text-gray-600 leading-relaxed">
            Welcome to Academic Connect. By using our service, you agree to these terms...
            {/* Standard boilerplate or app-specific rules */}
            1. You must be at least 18 years old.
            2. You must provide accurate academic credentials.
            3. Harassment is strictly prohibited.
         </Typography>
      </Paper>
    </div>
  );
};

export default TermsOfService;
