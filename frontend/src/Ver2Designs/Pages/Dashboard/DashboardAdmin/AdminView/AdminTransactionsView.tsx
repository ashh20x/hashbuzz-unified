import { adminApi } from '@/Ver2Designs/Admin/api/admin';
import type { AdminTransaction, TransactionFilters } from '@/types';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  FilterList as FilterIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Replay as RetryIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

const AdminTransactionsView = () => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [selectedTransaction, setSelectedTransaction] =
    useState<AdminTransaction | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  // RTK Query hooks
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = adminApi.useGetAllTransactionsQuery({
    page: page + 1,
    limit: rowsPerPage,
    ...filters,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = adminApi.useGetTransactionStatsQuery();

  const [updateTransactionStatus] =
    adminApi.useUpdateTransactionStatusMutation();
  const [retryTransaction] = adminApi.useRetryTransactionMutation();

  const transactions = transactionsData?.transactions || [];
  const totalCount = transactionsData?.count || 0;
  const stats = statsData || {
    totalTransactions: 0,
    pendingTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
  };

  // Handlers
  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const handleFilterChange = useCallback(
    (field: keyof TransactionFilters, value: string) => {
      setFilters(prev => ({
        ...prev,
        [field]: value || undefined,
      }));
      setPage(0);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    refetchTransactions();
    refetchStats();
  }, [refetchTransactions, refetchStats]);

  const handleViewTransaction = useCallback((transaction: AdminTransaction) => {
    setSelectedTransaction(transaction);
    setViewDialogOpen(true);
  }, []);

  const handleEditTransaction = useCallback((transaction: AdminTransaction) => {
    setSelectedTransaction(transaction);
    setEditStatus(transaction.status);
    setEditDialogOpen(true);
  }, []);

  const handleUpdateStatus = useCallback(async () => {
    if (!selectedTransaction) return;

    try {
      await updateTransactionStatus({
        id: selectedTransaction.id,
        status: editStatus,
      }).unwrap();
      setEditDialogOpen(false);
      refetchTransactions();
    } catch (_error) {
      console.error('Failed to update transaction status:', _error);
    }
  }, [
    selectedTransaction,
    editStatus,
    updateTransactionStatus,
    refetchTransactions,
  ]);

  const handleRetryTransaction = useCallback(
    async (transaction: AdminTransaction) => {
      try {
        await retryTransaction({ id: transaction.id }).unwrap();
        refetchTransactions();
      } catch (_error) {
        console.error('Failed to retry transaction:', _error);
      }
    },
    [retryTransaction, refetchTransactions]
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color='success' />;
      case 'failed':
        return <ErrorIcon color='error' />;
      case 'pending':
      case 'processing':
        return <PendingIcon color='warning' />;
      default:
        return <PendingIcon />;
    }
  };

  const getStatusColor = (
    status: string
  ): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Load data when dependencies change
  useEffect(() => {
    refetchTransactions();
    refetchStats();
  }, [page, rowsPerPage, filters, refetchTransactions, refetchStats]);

  if (transactionsError) {
    return (
      <Alert severity='error' sx={{ m: 2 }}>
        Failed to load transactions. Please try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h1'>
          Transaction Management
        </Typography>
        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={isLoadingTransactions}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant='h5' component='div'>
                {isLoadingStats ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.totalTransactions
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Successful
              </Typography>
              <Typography variant='h5' component='div' color='success.main'>
                {isLoadingStats ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.successfulTransactions
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Pending
              </Typography>
              <Typography variant='h5' component='div' color='warning.main'>
                {isLoadingStats ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.pendingTransactions
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Typography color='text.secondary' gutterBottom>
                Failed
              </Typography>
              <Typography variant='h5' component='div' color='error.main'>
                {isLoadingStats ? (
                  <CircularProgress size={24} />
                ) : (
                  stats.failedTransactions
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant='h6'>Filters</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 250px' }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={e => handleFilterChange('status', e.target.value)}
                  label='Status'
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='processing'>Processing</MenuItem>
                  <MenuItem value='success'>Success</MenuItem>
                  <MenuItem value='failed'>Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 250px' }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type || ''}
                  onChange={e => handleFilterChange('type', e.target.value)}
                  label='Type'
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='payment'>Payment</MenuItem>
                  <MenuItem value='reward'>Reward</MenuItem>
                  <MenuItem value='refund'>Refund</MenuItem>
                  <MenuItem value='transfer'>Transfer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 250px' }}>
              <FormControl fullWidth>
                <InputLabel>Network</InputLabel>
                <Select
                  value={filters.network || ''}
                  onChange={e => handleFilterChange('network', e.target.value)}
                  label='Network'
                >
                  <MenuItem value=''>All</MenuItem>
                  <MenuItem value='hedera'>Hedera</MenuItem>
                  <MenuItem value='testnet'>Testnet</MenuItem>
                  <MenuItem value='mainnet'>Mainnet</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Transactions
          </Typography>
          {isLoadingTransactions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Network</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Typography
                            variant='body2'
                            sx={{ fontFamily: 'monospace' }}
                          >
                            {transaction.transaction_id.slice(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant='body2'
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {transaction.transaction_type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant='body2'
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {transaction.network}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {transaction.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(transaction.status)}
                            label={transaction.status}
                            color={getStatusColor(transaction.status)}
                            size='small'
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction='row' spacing={1}>
                            <Tooltip title='View Details'>
                              <IconButton
                                size='small'
                                onClick={() =>
                                  handleViewTransaction(transaction)
                                }
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Edit Status'>
                              <IconButton
                                size='small'
                                onClick={() =>
                                  handleEditTransaction(transaction)
                                }
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {transaction.status === 'failed' && (
                              <Tooltip title='Retry Transaction'>
                                <IconButton
                                  size='small'
                                  onClick={() =>
                                    handleRetryTransaction(transaction)
                                  }
                                >
                                  <RetryIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component='div'
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* View Transaction Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Transaction ID
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ fontFamily: 'monospace', mb: 2 }}
                >
                  {selectedTransaction.transaction_id}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Type
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ mb: 2, textTransform: 'capitalize' }}
                >
                  {selectedTransaction.transaction_type}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Network
                </Typography>
                <Typography
                  variant='body2'
                  sx={{ mb: 2, textTransform: 'capitalize' }}
                >
                  {selectedTransaction.network}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Amount
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {selectedTransaction.amount}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Status
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedTransaction.status)}
                  label={selectedTransaction.status}
                  color={getStatusColor(selectedTransaction.status)}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Created
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {new Date(selectedTransaction.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant='subtitle2' gutterBottom>
                  Transaction Data
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                    }}
                  >
                    {JSON.stringify(
                      selectedTransaction.transaction_data,
                      null,
                      2
                    )}
                  </pre>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Update Transaction Status</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ pt: 1 }}>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Transaction: {selectedTransaction.transaction_id.slice(0, 20)}
                ...
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  label='Status'
                >
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='processing'>Processing</MenuItem>
                  <MenuItem value='success'>Success</MenuItem>
                  <MenuItem value='failed'>Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant='contained'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTransactionsView;
