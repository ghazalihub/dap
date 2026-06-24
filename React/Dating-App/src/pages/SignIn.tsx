import { useState } from 'react';
import {
  Button, TextField, Typography, Box, Paper, Container, CircularProgress
} from '@mui/material';
import {
  RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult
} from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('+1');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(verificationCode);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" className="min-h-screen flex items-center justify-center">
      <Paper elevation={3} className="p-8 w-full rounded-2xl">
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-bold text-primary mb-2">Connect</Typography>
          <Typography variant="body2" className="text-gray-500">The platform for ambitious minds</Typography>
        </Box>

        {!confirmationResult ? (
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSendCode}
              disabled={loading}
              className="py-3 rounded-lg"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleVerifyCode}
              disabled={loading}
              className="py-3 rounded-lg"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Continue"}
            </Button>
          </div>
        )}

        <div id="recaptcha-container"></div>
        {error && <Typography color="error" className="mt-4 text-center text-sm">{error}</Typography>}
      </Paper>
    </Container>
  );
};

export default SignIn;
