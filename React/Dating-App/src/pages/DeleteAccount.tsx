import {
  Typography, Box, Button,
  Paper, IconButton, TextField
} from '@mui/material';
import { ArrowBack, WarningAmber } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you absolutely sure? This action cannot be undone.")) {
       // Logic for account deletion
       await auth.signOut();
       navigate('/signin');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2 mb-4">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Delete Account</Typography>
      </header>

      <Box className="bg-red-50 p-8 rounded-[2rem] text-center border border-red-100">
         <WarningAmber className="text-red-500 text-5xl mb-4" />
         <Typography variant="h6" className="font-bold text-red-800 mb-2">We're sorry to see you go</Typography>
         <Typography variant="body2" className="text-red-600 opacity-80">
            Deleting your account will permanently remove your matches, messages, and verification status.
         </Typography>
      </Box>

      <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
         <Typography variant="subtitle2" className="font-bold">Please tell us why you are leaving:</Typography>
         <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Feedback (Optional)"
            variant="outlined"
            className="bg-gray-50 rounded-2xl"
         />

         <Button
            fullWidth
            variant="contained"
            color="error"
            className="rounded-full py-4 font-bold"
            onClick={handleDelete}
         >
            Permanently Delete My Data
         </Button>
         <Button
            fullWidth
            onClick={() => navigate(-1)}
            className="text-gray-400"
         >
            Keep My Account
         </Button>
      </Paper>
    </div>
  );
};

export default DeleteAccount;
