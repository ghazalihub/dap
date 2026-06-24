import {
  Dialog, DialogContent, Typography,
  Avatar, Box, Button
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../types/user';

interface MatchDialogProps {
  open: boolean;
  onClose: () => void;
  matchUser: User;
  currentUser: User;
}

export const MatchDialog = ({ open, onClose, matchUser, currentUser }: MatchDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        style: { background: 'linear-gradient(to bottom, #E91E63, #ff4081)', color: 'white' }
      }}
    >
      <DialogContent className="flex flex-col items-center justify-center space-y-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        >
           <Typography variant="h3" className="font-black italic text-center">IT'S A MATCH!</Typography>
           <Typography variant="h6" className="text-center opacity-80">You and {matchUser.userFullname} have liked each other.</Typography>
        </motion.div>

        <div className="flex items-center gap-4 relative">
           <motion.div
             initial={{ x: -50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
           >
              <Avatar src={currentUser.userProfilePhoto} className="w-32 h-32 border-4 border-white shadow-xl" />
           </motion.div>

           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.6 }}
             className="absolute left-1/2 -translate-x-1/2 z-10 bg-white p-2 rounded-full shadow-lg"
           >
              <Favorite className="text-primary text-4xl" />
           </motion.div>

           <motion.div
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
           >
              <Avatar src={matchUser.userProfilePhoto} className="w-32 h-32 border-4 border-white shadow-xl" />
           </motion.div>
        </div>

        <Box className="w-full max-w-xs space-y-4">
           <Button
             fullWidth
             variant="contained"
             className="bg-white text-primary hover:bg-gray-100 rounded-full py-4 font-bold"
             onClick={onClose}
           >
             Send a Message
           </Button>
           <Button
             fullWidth
             className="text-white border border-white/30 rounded-full py-3"
             onClick={onClose}
           >
             Keep Swiping
           </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
