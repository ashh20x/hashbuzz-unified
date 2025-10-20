import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  CampaignLogEntry,
  useGetCampaignLogsQuery,
} from '../../../../../API/campaign';

interface CampaignTimelineModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
}

const CampaignTimelineModal: React.FC<CampaignTimelineModalProps> = ({
  open,
  onClose,
  campaignId,
}) => {
  const { data, isLoading, error } = useGetCampaignLogsQuery(campaignId, {
    skip: !open, // Don't fetch if modal is closed
  });

  const getStatusColor = (
    status: string
  ):
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | 'default' => {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('SUCCESS') || statusUpper.includes('COMPLETE'))
      return 'success';
    if (statusUpper.includes('ERROR') || statusUpper.includes('FAIL'))
      return 'error';
    if (statusUpper.includes('WARN')) return 'warning';
    if (statusUpper.includes('PROCESS') || statusUpper.includes('PENDING'))
      return 'info';
    return 'primary';
  };

  const getStatusIcon = (status: string) => {
    const color = getStatusColor(status);
    const iconProps = { fontSize: 'small' as const };

    switch (color) {
      case 'success':
        return <CheckCircleIcon {...iconProps} color='success' />;
      case 'error':
        return <ErrorIcon {...iconProps} color='error' />;
      case 'warning':
        return <WarningIcon {...iconProps} color='warning' />;
      case 'info':
        return <InfoIcon {...iconProps} color='info' />;
      default:
        return <InfoIcon {...iconProps} color='primary' />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const renderLogData = (data: Record<string, unknown> | null) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }} variant='outlined'>
        <Typography variant='caption' color='text.secondary' gutterBottom>
          Event Data:
        </Typography>
        <pre
          style={{
            fontSize: '11px',
            margin: 0,
            overflow: 'auto',
            maxHeight: '150px',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h6'>
            Campaign Timeline - ID: {campaignId}
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error'>
            Error loading campaign logs. Please try again.
          </Typography>
        ) : !data?.data?.logs || data.data.logs.length === 0 ? (
          <Typography color='text.secondary' sx={{ textAlign: 'center', p: 3 }}>
            No logs available for this campaign.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {data.data.logs.map((log: CampaignLogEntry, index: number) => (
              <Box key={log.id}>
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Box
                    sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                  >
                    {/* Icon */}
                    <Box sx={{ mt: 0.5 }}>{getStatusIcon(log.status)}</Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={log.status}
                          color={getStatusColor(log.status)}
                          size='small'
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant='caption' color='text.secondary'>
                            {formatDate(log.created_at)}
                          </Typography>
                          <br />
                          <Typography
                            variant='caption'
                            fontWeight='bold'
                            color='text.secondary'
                          >
                            {formatTime(log.created_at)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant='body1' fontWeight='medium'>
                        {log.message}
                      </Typography>

                      {renderLogData(log.data)}
                    </Box>
                  </Box>
                </Paper>
                {index < data.data.logs.length - 1 && (
                  <Divider
                    sx={{ my: 1, ml: 3 }}
                    orientation='vertical'
                    flexItem
                  />
                )}
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignTimelineModal;
