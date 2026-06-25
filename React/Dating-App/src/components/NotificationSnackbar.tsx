import { Snackbar, Alert } from '@mui/material';
import { create } from 'zustand';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  show: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  hide: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  show: (message, severity = 'info') => set({ open: true, message, severity }),
  hide: () => set({ open: false }),
}));

export const NotificationSnackbar = () => {
  const { open, message, severity, hide } = useSnackbarStore();
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={hide} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={hide} severity={severity} sx={{ width: '100%', borderRadius: '1rem' }} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
