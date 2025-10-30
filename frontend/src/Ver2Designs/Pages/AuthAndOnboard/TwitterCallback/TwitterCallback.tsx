import { useHandleTwitterCallbackMutation } from '@/API/integration';
import { userApi } from '@/API/user';
import { useAppDispatch } from '@/Store/store';
import { connectXAccount } from '@/Ver2Designs/Pages/AuthAndOnboard/authStoreSlice';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  variant: 'personal' | 'business';
}

const TwitterCallback: React.FC<Props> = ({ variant = 'personal' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [handleCallback, { error }] = useHandleTwitterCallbackMutation();

  // Helper function to invalidate user cache and navigate
  const navigateWithCacheReset = useCallback(
    (path: string, options?: Record<string, unknown>) => {
      // Invalidate current user cache to force fresh data load
      dispatch(
        userApi.util.invalidateTags(['CurrentUser', 'UserData', 'TokenBalance'])
      );
      navigate(path, options);
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const oauth_token = searchParams.get('oauth_token');
      const oauth_verifier = searchParams.get('oauth_verifier');

      // Check if we have the required parameters
      if (variant === 'personal' && (!oauth_token || !oauth_verifier)) {
        console.error('Missing OAuth parameters');
        navigateWithCacheReset('/auth/connect-x-account', {
          replace: true,
          state: { error: 'OAuth callback failed - missing parameters' },
        });
        return;
      }
      if (variant === 'business' && (!oauth_token || !oauth_verifier)) {
        console.error('Missing OAuth parameters');
        navigateWithCacheReset('/app/dashboard', {
          replace: true,
          state: { error: 'OAuth callback failed - missing parameters' },
        });
        return;
      }

      try {
        // Process the callback via API
        const result = await handleCallback({
          oauth_token: oauth_token || '',
          oauth_verifier: oauth_verifier || '',
          variant,
        }).unwrap();

        if (result.success) {
          // Update Redux state with successful connection
          // Navigate to next step based on variant
          if (variant === 'personal') {
            dispatch(connectXAccount(result.username || ''));
            navigateWithCacheReset('/auth/associate-tokens', { replace: true });
          } else if (variant === 'business') {
            navigateWithCacheReset('/app/dashboard', { replace: true });
            toast.success(
              `Successfully connected your business 𝕏 account${result.username ? `: @${result.username}` : ''}!`
            );
          }
        } else {
          throw new Error(result.message || 'Failed to connect X account');
        }
      } catch (err: unknown) {
        console.error('Twitter callback error:', err);

        const getErrorMessage = (error: unknown): string => {
          if (error && typeof error === 'object') {
            const e = error as Record<string, unknown>;
            const dataMessage =
              e.data &&
              typeof e.data === 'object' &&
              (e.data as Record<string, unknown>).message;
            const directMessage = e.message;

            return (
              (typeof dataMessage === 'string' ? dataMessage : '') ||
              (typeof directMessage === 'string' ? directMessage : '') ||
              'Failed to connect X account. Please try again.'
            );
          }
          return 'Failed to connect X account. Please try again.';
        };

        const errorMessage = getErrorMessage(err);

        if (variant === 'personal') {
          navigateWithCacheReset('/auth/connect-x-account', {
            replace: true,
            state: { error: errorMessage },
          });
          toast.error(errorMessage);
        } else {
          navigateWithCacheReset('/app/dashboard', {
            replace: true,
            state: { error: errorMessage },
          });
          toast.error(errorMessage);
        }
      }
    };

    handleOAuthCallback();
  }, [
    location.search,
    handleCallback,
    dispatch,
    navigate,
    variant,
    navigateWithCacheReset,
  ]);

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      minHeight='100vh'
      p={4}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />

      <Typography variant='h5' component='h1' gutterBottom>
        Connecting your 𝕏 account...
      </Typography>

      <Typography
        variant='body1'
        color='text.secondary'
        textAlign='center'
        sx={{ mb: 3 }}
      >
        Please wait while we complete the connection process.
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          Connection failed. Redirecting back...
        </Alert>
      )}
    </Box>
  );
};

export default TwitterCallback;
