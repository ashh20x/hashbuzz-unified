import {
  useGetBullMQHealthQuery,
  useGetStuckCampaignsQuery,
  useGetSystemHealthQuery,
  useGetTokenSyncStatusQuery,
} from '@/API/monitoring';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const AdminMonitoringView: React.FC = () => {
  const [pollingInterval] = useState(30000); // 30 seconds

  // RTK Query hooks with auto-refresh
  const {
    data: systemHealthData,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
  } = useGetSystemHealthQuery(undefined, {
    pollingInterval,
  });

  const {
    data: bullmqData,
    isLoading: bullmqLoading,
    error: bullmqError,
    refetch: refetchBullMQ,
  } = useGetBullMQHealthQuery(undefined, {
    pollingInterval,
  });

  const {
    data: stuckCampaignsData,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useGetStuckCampaignsQuery(undefined, {
    pollingInterval,
  });

  const {
    data: _tokenSyncData,
    isLoading: tokenLoading,
    error: tokenError,
    refetch: refetchTokens,
  } = useGetTokenSyncStatusQuery(undefined, {
    pollingInterval,
  });

  // Transform data for display
  const systemHealth = systemHealthData?.data
    ? {
        status: (systemHealthData.data.overall.healthy
          ? 'healthy'
          : 'degraded') as 'healthy' | 'degraded' | 'down',
        uptime: 0, // Backend doesn't provide uptime yet
        timestamp: systemHealthData.timestamp,
      }
    : null;

  const campaignStats = stuckCampaignsData?.data
    ? {
        total: stuckCampaignsData.data.count,
        active: stuckCampaignsData.data.count,
        completed: 0,
        failed: stuckCampaignsData.data.summary?.overdue_close || 0,
      }
    : null;

  const eventQueueStats = bullmqData?.data
    ? {
        pending: bullmqData.data.waitingJobs,
        processing: bullmqData.data.activeJobs,
        completed: bullmqData.data.completedJobs,
        failed: bullmqData.data.failedJobs,
        deadLetter: bullmqData.data.eventQueue?.deadLetter || 0,
        eventPending: bullmqData.data.eventQueue?.pending || 0,
      }
    : null;

  // Services status from multiple sources
  const services = [
    {
      name: 'BullMQ',
      status: bullmqData?.data.isConnected
        ? ('online' as const)
        : ('offline' as const),
      lastCheck: bullmqData?.timestamp || new Date().toISOString(),
      responseTime: undefined,
    },
    {
      name: 'Database',
      status: systemHealthData?.data.database.connected
        ? ('online' as const)
        : ('offline' as const),
      lastCheck: systemHealthData?.timestamp || new Date().toISOString(),
      responseTime: undefined,
    },
    {
      name: 'Redis',
      status: systemHealthData?.data.redis.connected
        ? ('online' as const)
        : ('offline' as const),
      lastCheck: systemHealthData?.timestamp || new Date().toISOString(),
      responseTime: undefined,
    },
  ];

  const loading =
    healthLoading || bullmqLoading || campaignsLoading || tokenLoading;
  const hasError = healthError || bullmqError || campaignsError || tokenError;

  const handleRefreshAll = () => {
    void refetchHealth();
    void refetchBullMQ();
    void refetchCampaigns();
    void refetchTokens();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircleIcon color='success' />;
      case 'degraded':
      case 'warning':
        return <WarningIcon color='warning' />;
      case 'down':
      case 'offline':
      case 'error':
        return <ErrorIcon color='error' />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const getStatusColor = (
    status: string
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'success';
      case 'degraded':
      case 'warning':
        return 'warning';
      case 'down':
      case 'offline':
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading && !systemHealth) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='400px'
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={3}
      >
        <Typography variant='h4' component='h1'>
          System Monitoring Dashboard
        </Typography>
        <Box display='flex' gap={2} alignItems='center'>
          <Typography variant='caption' color='text.secondary'>
            Auto-refreshing every 30s
          </Typography>
          <Tooltip title='Refresh Now'>
            <IconButton onClick={handleRefreshAll} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {hasError && (
        <Alert severity='warning' sx={{ mb: 3 }}>
          Some monitoring data failed to load. Please check if backend API is
          running and you have admin access.
        </Alert>
      )}

      {/* System Health Overview */}
      <Box display='flex' gap={3} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display='flex' alignItems='center' gap={1} mb={1}>
                {getStatusIcon(systemHealth?.status || 'unknown')}
                <Typography variant='h6'>System Status</Typography>
              </Box>
              <Chip
                label={systemHealth?.status?.toUpperCase() || 'UNKNOWN'}
                color={getStatusColor(systemHealth?.status || 'unknown')}
                size='small'
              />
              {systemHealth?.uptime && (
                <Typography variant='body2' color='text.secondary' mt={1}>
                  Uptime: {formatUptime(systemHealth.uptime)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Active Campaigns
              </Typography>
              <Typography variant='h3' color='primary'>
                {campaignStats?.active || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total: {campaignStats?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Event Queue
              </Typography>
              <Typography variant='h3' color='warning.main'>
                {eventQueueStats?.pending || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Pending processing
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Failed Events
              </Typography>
              <Typography variant='h3' color='error.main'>
                {eventQueueStats?.failed || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Dead Letter Queue
              </Typography>
              <Typography
                variant='h3'
                color={
                  (eventQueueStats?.deadLetter || 0) > 0
                    ? 'error.main'
                    : 'text.secondary'
                }
              >
                {eventQueueStats?.deadLetter || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Manual review required
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Services Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Services Status
          </Typography>
          <TableContainer component={Paper} variant='outlined'>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Last Check</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.length > 0 ? (
                  services.map(service => (
                    <TableRow key={service.name}>
                      <TableCell>
                        <Box display='flex' alignItems='center' gap={1}>
                          {getStatusIcon(service.status)}
                          {service.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.status.toUpperCase()}
                          color={getStatusColor(service.status)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        {service.responseTime
                          ? `${service.responseTime}ms`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(service.lastCheck).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align='center'>
                      <Typography color='text.secondary'>
                        No service data available. Configure monitoring
                        endpoints.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Campaign Statistics */}
      <Box display='flex' gap={3} sx={{ flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Campaign Statistics
              </Typography>
              {campaignStats ? (
                <Box display='flex' gap={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='body2' color='text.secondary'>
                      Completed
                    </Typography>
                    <Typography variant='h4' color='success.main'>
                      {campaignStats.completed}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='body2' color='text.secondary'>
                      Failed
                    </Typography>
                    <Typography variant='h4' color='error.main'>
                      {campaignStats.failed}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color='text.secondary'>
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Event Queue Statistics
              </Typography>
              {eventQueueStats ? (
                <>
                  <Box display='flex' gap={2} mb={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Processing
                      </Typography>
                      <Typography variant='h4' color='info.main'>
                        {eventQueueStats.processing}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Completed
                      </Typography>
                      <Typography variant='h4' color='success.main'>
                        {eventQueueStats.completed}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display='flex' gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Event Pending
                      </Typography>
                      <Typography variant='h4' color='warning.main'>
                        {eventQueueStats.eventPending}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Dead Letter
                      </Typography>
                      <Typography
                        variant='h4'
                        color={
                          eventQueueStats.deadLetter > 0
                            ? 'error.main'
                            : 'text.secondary'
                        }
                      >
                        {eventQueueStats.deadLetter}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography color='text.secondary'>
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box mt={3} display='flex' gap={2}>
        <Button
          variant='outlined'
          href='http://localhost:4000/api/v201/monitoring/health/system'
          target='_blank'
        >
          View System Health JSON
        </Button>
        <Button variant='outlined' href='http://localhost:5555' target='_blank'>
          Open Prisma Studio
        </Button>
      </Box>
    </Box>
  );
};

export default AdminMonitoringView;
