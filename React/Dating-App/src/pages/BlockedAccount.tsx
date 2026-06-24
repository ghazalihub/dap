import { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Paper
} from '@mui/material';
import { Block, Gavel, HelpOutline } from '@mui/icons-material';
import { auth } from '../api/firebase';
import type { User } from '../types/user';

interface BlockedAccountProps {
  user: User;
}

const BlockedAccount = ({ user }: BlockedAccountProps) => {
  const isBanned = user.user_status === 'banned';
  const expiryDate = user.sanction_expiry?.seconds ? new Date(user.sanction_expiry.seconds * 1000).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Paper className="max-w-md w-full p-8 text-center rounded-3xl shadow-xl border border-gray-100">
        <Box className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
           {isBanned ? <Gavel fontSize="large" /> : <Block fontSize="large" />}
        </Box>

        <Typography variant="h5" className="font-bold mb-2">
          Account {isBanned ? 'Banned' : 'Suspended'}
        </Typography>

        <Typography variant="body2" className="text-gray-500 mb-8">
          Your access to Academic Connect has been restricted due to a violation of our community guidelines.
        </Typography>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left mb-8 space-y-3">
           <div>
              <Typography variant="caption" className="font-bold text-gray-400 uppercase">Reason</Typography>
              <Typography variant="body2" className="font-medium">{user.sanction_reason || 'Terms of Service violation.'}</Typography>
           </div>
           {!isBanned && (
             <div>
                <Typography variant="caption" className="font-bold text-gray-400 uppercase">Suspension Ends</Typography>
                <Typography variant="body2" className="font-medium">{expiryDate}</Typography>
             </div>
           )}
        </div>

        <div className="space-y-4">
           <Button
             fullWidth
             variant="contained"
             color="primary"
             className="rounded-full py-3"
             startIcon={<HelpOutline />}
           >
             Contact Support
           </Button>
           <Button
             fullWidth
             onClick={() => auth.signOut()}
             className="text-gray-400"
           >
             Sign Out
           </Button>
        </div>
      </Paper>
    </div>
  );
};

export default BlockedAccount;
