import { useRemoteConfig } from '@/hooks/useRemoteConfig';
import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import CreateCampaign from './CreateCampaign/CreateCampaign';
import CreateCampaignV201 from './CreateCampaignV201';

const CampaignCreatorWrapper: React.FC = () => {
  const campaignV201Enabled = useRemoteConfig('campaign_v201') as boolean;

  // Show loading while feature flags are being fetched
  if (campaignV201Enabled === undefined) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Conditionally render based on feature flag
  return campaignV201Enabled ? <CreateCampaignV201 /> : <CreateCampaign />;
};

export default CampaignCreatorWrapper;
