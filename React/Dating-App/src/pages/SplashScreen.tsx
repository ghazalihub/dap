import { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { School } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
           <School className="text-white text-5xl" />
        </div>
        <Typography variant="h4" className="font-black italic tracking-tighter mb-2">CONNECT</Typography>
        <Typography variant="caption" className="uppercase font-bold tracking-[0.3em] opacity-60">Academic Edition</Typography>
      </motion.div>

      <Box className="absolute bottom-20">
         <CircularProgress size={24} color="inherit" className="opacity-40" />
      </Box>
    </div>
  );
};

export default SplashScreen;
