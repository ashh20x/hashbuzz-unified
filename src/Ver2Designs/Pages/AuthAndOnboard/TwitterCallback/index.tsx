import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useHandleTwitterCallbackMutation } from '@/API/integration';
import { useAppDispatch } from '@/Store/store';
import { connectXAccount } from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';

/**
 * TwitterCallback component handles the OAuth callback from X (Twitter).
 * Extracts OAuth parameters from URL and processes them via API.
 * Updates Redux state and navigates to next step on success.
 */
const TwitterCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [handleCallback, { error }] = useHandleTwitterCallbackMutation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Extract OAuth parameters from URL
      const searchParams = new URLSearchParams(location.search);
      const oauth_token = searchParams.get('oauth_token');
      const oauth_verifier = searchParams.get('oauth_verifier');

      // Check if we have the required parameters
      if (!oauth_token || !oauth_verifier) {
        console.error('Missing OAuth parameters');
        navigate('/auth/connect-x-account', { 
          replace: true,
          state: { error: 'OAuth callback failed - missing parameters' }
        });
        return;
      }

      try {
        // Process the callback via API
        const result = await handleCallback({
          oauth_token,
          oauth_verifier
        }).unwrap();

        if (result.success) {
          // Update Redux state with successful connection
          dispatch(connectXAccount(result.username || ''));

          // Navigate to next step (Associate Tokens) or dashboard
          navigate('/auth/associate-tokens', { replace: true });
        } else {
          throw new Error(result.message || 'Failed to connect X account');
        }
      } catch (err: any) {
        console.error('Twitter callback error:', err);
        
        // Navigate back to connect page with error
        navigate('/auth/connect-x-account', {
          replace: true,
          state: { 
            error: err?.data?.message || err?.message || 'Failed to connect X account. Please try again.' 
          }
        });
      }
    };

    handleOAuthCallback();
  }, [location.search, handleCallback, dispatch, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      
      <Typography variant="h5" component="h1" gutterBottom>
        Connecting your 𝕏 account...
      </Typography>
      
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Please wait while we complete the connection process.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Connection failed. Redirecting back...
        </Alert>
      )}
    </Box>
  );
};

export default TwitterCallback;
