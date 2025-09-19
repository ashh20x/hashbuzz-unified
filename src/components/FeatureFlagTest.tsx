import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { isFeatureEnabled, isRemoteConfigInitialized } from '@/remoteConfig';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const FeatureFlagTest: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test individual flags using the hook
  const campaignV201Flag = useRemoteConfig('campaign_v201') as boolean;
  const chatUIFlag = useRemoteConfig('enable_new_chat_ui') as boolean;

  const [directFlags, setDirectFlags] = useState({
    campaign_v201: false,
    enable_new_chat_ui: false,
  });

  const checkInitializationStatus = () => {
    const isInit = isRemoteConfigInitialized();
    setInitialized(isInit);

    if (isInit) {
      // Test direct access
      setDirectFlags({
        campaign_v201: isFeatureEnabled('campaign_v201'),
        enable_new_chat_ui: isFeatureEnabled('enable_new_chat_ui'),
      });
      setError(null);
    }
  };

  useEffect(() => {
    checkInitializationStatus();

    // Check periodically if not initialized yet
    const interval = setInterval(() => {
      if (!initialized) {
        checkInitializationStatus();
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [initialized]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        Feature Flag Test Dashboard
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Initialization Status
          </Typography>
          <Chip
            label={initialized ? 'Initialized' : 'Not Initialized'}
            color={initialized ? 'success' : 'default'}
            sx={{ mr: 1 }}
          />
          {error && (
            <Typography color='error' variant='body2'>
              Error: {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Feature Flags (via Hook)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`campaign_v201: ${campaignV201Flag}`}
              color={campaignV201Flag ? 'success' : 'default'}
            />
            <Chip
              label={`enable_new_chat_ui: ${chatUIFlag}`}
              color={chatUIFlag ? 'success' : 'default'}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Feature Flags (Direct Access)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`campaign_v201: ${directFlags.campaign_v201}`}
              color={directFlags.campaign_v201 ? 'success' : 'default'}
            />
            <Chip
              label={`enable_new_chat_ui: ${directFlags.enable_new_chat_ui}`}
              color={directFlags.enable_new_chat_ui ? 'success' : 'default'}
            />
          </Box>
        </CardContent>
      </Card>

      <Button
        variant='contained'
        onClick={checkInitializationStatus}
        sx={{ mt: 2 }}
      >
        Refresh Flags
      </Button>
    </Box>
  );
};

export default FeatureFlagTest;
