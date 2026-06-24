import { Box, Typography, CircularProgress } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

export const NoData = ({ message = "No data found." }: { message?: string }) => (
  <Box className="flex flex-col items-center justify-center p-12 opacity-30 text-center">
    <SearchOff className="text-6xl mb-2" />
    <Typography variant="body2" className="font-bold uppercase tracking-widest">{message}</Typography>
  </Box>
);

export const LoadingCard = () => (
  <Box className="w-full p-10 flex justify-center">
    <CircularProgress size={32} />
  </Box>
);
