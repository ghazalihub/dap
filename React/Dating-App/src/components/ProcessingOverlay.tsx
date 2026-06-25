import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

export const ProcessingOverlay = ({ open, message = "Processing..." }: { open: boolean, message?: string }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000, display: 'flex', flexDirection: 'column', gap: 2 }}
    open={open}
  >
    <CircularProgress color="inherit" />
    <Typography variant="h6" className="font-bold">{message}</Typography>
  </Backdrop>
);
