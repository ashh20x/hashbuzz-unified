import {
  useAllowUserAsCampaignerMutation,
  useGetAllUsersQuery,
  useRemoveBizHandleMutation,
  useRemovePersonalHandleMutation,
} from '@/Ver2Designs/Admin/api/admin';
import { Delete } from '@mui/icons-material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { toast } from 'react-toastify';
import { CurrentUser } from '../../../../../types';

const ROLE_MAPPER = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ANALYTICS: 'Analyst',
  MARKETING: 'Marketing',
  MANAGEMENT: 'Management',
  USER: 'Campaigner',
  GUEST_USER: 'Intractor',
};

export const AdminUsersViews = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [userInview, setUserInView] = React.useState<CurrentUser | null>(null);

  const {
    data: allUsers,
    isLoading,
    error,
    refetch,
  } = useGetAllUsersQuery(
    {
      limit: rowsPerPage,
      offset: page * rowsPerPage,
    },
    {
      refetchOnFocus: true,
    }
  );

  const [allowUserAsCampaigner] = useAllowUserAsCampaignerMutation();
  const [removePersonalHandle, { isLoading: isLoadingPersonal }] =
    useRemovePersonalHandleMutation();
  const [removeBusinessHandle, { isLoading: isLoadingBusiness }] =
    useRemoveBizHandleMutation();

  const handleActionClick = async (id: number) => {
    try {
      await allowUserAsCampaigner(id).unwrap();
      toast.success('User allowed as campaigner successfully');
      refetch();
    } catch {
      toast.error('Error allowing user as campaigner');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (userData: CurrentUser) => {
    setUserInView(userData);
  };

  const handleModalClose = () => {
    setUserInView(null);
  };

  const handlePersonalHandleRemove = async (id: number) => {
    try {
      await removePersonalHandle(id);
      toast.success('Personal handle removed successfully');
      refetch();
    } catch {
      toast.error('Something error handle while removing');
    }
  };

  const handlebizHandleRemove = async (id: number) => {
    try {
      await removeBusinessHandle(id);
      toast.success('Business handle removed successfully');
      refetch();
    } catch {
      toast.error('Something error handle while removing');
    }
  };

  const getRoleColor = (
    role: string
  ): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return 'error';
      case 'USER':
        return 'success';
      case 'GUEST_USER':
        return 'warning';
      default:
        return 'primary';
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color='error'>
          Error loading users. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant='h5' gutterBottom>
        User Management
      </Typography>

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
                  <TableCell>User ID</TableCell>
                  <TableCell>Personal X Account</TableCell>
                  <TableCell>Business X Account</TableCell>
                  <TableCell>Wallet ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(allUsers?.users) &&
                  allUsers.users.map((user: CurrentUser) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant='body2' fontWeight='bold'>
                          {user.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {user.personal_twitter_handle || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {user.business_twitter_handle || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant='body2'
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={user.hedera_wallet_id}
                        >
                          {user.hedera_wallet_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ROLE_MAPPER[user.role] || user.role}
                          color={getRoleColor(user.role)}
                          size='small'
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size='small'
                            variant='contained'
                            color='primary'
                            disabled={user.role !== 'GUEST_USER'}
                            onClick={() => handleActionClick(Number(user.id))}
                            sx={{ textTransform: 'none' }}
                          >
                            Allow as Campaigner
                          </Button>
                          <IconButton
                            size='small'
                            onClick={() => handleViewClick(user)}
                            title='View Details'
                          >
                            <RemoveRedEyeIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component='div'
            count={allUsers?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* User Details Modal */}
      <Dialog
        maxWidth='md'
        open={Boolean(userInview)}
        onClose={handleModalClose}
        fullWidth
      >
        <DialogTitle>User Wallet: {userInview?.hedera_wallet_id}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Metrics</TableCell>
                <TableCell>Values</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Personal Handle</TableCell>
                <TableCell>
                  {userInview?.personal_twitter_handle ?? 'N/A'}
                  <IconButton
                    title='Remove this handle'
                    size='small'
                    color='error'
                    disabled={
                      isLoadingPersonal || !userInview?.personal_twitter_handle
                    }
                    sx={{ marginLeft: 2 }}
                    onClick={() =>
                      handlePersonalHandleRemove(Number(userInview?.id))
                    }
                  >
                    <Delete fontSize='inherit' />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Business Handle</TableCell>
                <TableCell>
                  {userInview?.business_twitter_handle ?? 'N/A'}
                  <IconButton
                    title='Remove this business handle'
                    size='small'
                    color='error'
                    disabled={
                      isLoadingBusiness || !userInview?.business_twitter_handle
                    }
                    sx={{ marginLeft: 2 }}
                    onClick={() =>
                      handlebizHandleRemove(Number(userInview?.id))
                    }
                  >
                    <Delete fontSize='inherit' />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>HBAR Balance</TableCell>
                <TableCell>{userInview?.available_budget}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Reward Gained</TableCell>
                <TableCell>{userInview?.total_rewarded}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminUsersViews;
