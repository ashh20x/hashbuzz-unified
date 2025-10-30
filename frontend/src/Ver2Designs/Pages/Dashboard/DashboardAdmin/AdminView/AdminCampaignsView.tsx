import {
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useState } from 'react';
import {
  AdminCampaignListItem,
  useGetAdminCampaignListQuery,
} from '../../../../../API/campaign';
import CampaignTimelineModal from './CampaignTimelineModal';

const AdminCampaignsView: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);

  const { data, isLoading, error } = useGetAdminCampaignListQuery({
    page: page + 1, // Backend uses 1-indexed pages
    limit: rowsPerPage,
    status: statusFilter || undefined,
    campaignType: typeFilter || undefined,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleTypeFilterChange = (event: SelectChangeEvent<string>) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleRowClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setTimelineModalOpen(true);
  };

  const handleCloseTimeline = () => {
    setTimelineModalOpen(false);
    setSelectedCampaignId(null);
  };

  const getStatusColor = (
    status: string | undefined | null
  ): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    if (!status) return 'default';

    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'PAUSED':
        return 'warning';
      case 'COMPLETED':
        return 'primary';
      case 'DRAFT':
        return 'default';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatBudget = (budget: string) => {
    const num = parseFloat(budget);
    return num.toFixed(2);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>
          Error loading campaigns. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant='h5' gutterBottom>
        Campaign Management
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }} size='small'>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label='Status'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='DRAFT'>Draft</MenuItem>
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='PAUSED'>Paused</MenuItem>
              <MenuItem value='COMPLETED'>Completed</MenuItem>
              <MenuItem value='FAILED'>Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size='small'>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              label='Type'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='HBAR'>HBAR</MenuItem>
              <MenuItem value='FUNGIBLE'>Fungible Token</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align='right'>Budget</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.campaigns?.map(
                  (campaign: AdminCampaignListItem) => (
                    <TableRow
                      key={campaign.id}
                      hover
                      onClick={() => handleRowClick(campaign.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <TableCell>{campaign.id}</TableCell>
                      <TableCell>
                        <Typography variant='body2' fontWeight='bold'>
                          {campaign.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.campaign_status || 'UNKNOWN'}
                          color={getStatusColor(campaign.campaign_status)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.campaign_type || 'UNKNOWN'}
                          variant='outlined'
                          size='small'
                        />
                      </TableCell>
                      <TableCell align='right'>
                        {formatBudget(campaign.campaign_budget)}
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {campaign.owner?.user_name || 'Unknown'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {campaign.owner?.email || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption'>
                          {formatDate(campaign.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='caption'>
                          {formatDate(campaign.updated_at)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component='div'
            count={data?.data?.pagination?.totalItems || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Timeline Modal */}
      {selectedCampaignId && (
        <CampaignTimelineModal
          open={timelineModalOpen}
          onClose={handleCloseTimeline}
          campaignId={selectedCampaignId}
        />
      )}
    </Box>
  );
};

export default AdminCampaignsView;
