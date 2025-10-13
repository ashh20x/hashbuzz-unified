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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { sortBy } from 'lodash';
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

const UsersLIstCol: GridColDef[] = [
  {
    field: 'id',
    headerName: 'User Id',
    width: 200,
    align: 'center',
  },
  {
    field: 'personal_twitter_handle',
    headerName: 'Personal X account',
    minWidth: 200,
  },
  {
    field: 'hedera_wallet_id',
    headerName: 'Wallet Id',
    minWidth: 200,
  },
  {
    field: 'role',
    headerName: 'User Role',
    minWidth: 200,
    valueFormatter: (params: keyof typeof ROLE_MAPPER) => ROLE_MAPPER[params],
  },
];

export const AdminUsersViews = () => {
  const [pagination, setPagination] = React.useState({
    limit: 10,
    offset: 0,
    page: 1,
  });
  const {
    data: allUsers,
    isLoading,
    refetch,
  } = useGetAllUsersQuery(pagination, {
    refetchOnFocus: true,
  });
  const [allowUserAsCampaigner] = useAllowUserAsCampaignerMutation();
  const [removePersonalHandle, { isLoading: isLoadingPersonal }] =
    useRemovePersonalHandleMutation();
  const [removeBusinessHandle, { isLoading: isLoadingBusiness }] =
    useRemoveBizHandleMutation();
  const [userInview, setUserInView] = React.useState<CurrentUser | null>(null);

  const handleActionClick = async (id: number) => {
    await allowUserAsCampaigner(id).unwrap();
    refetch();
  };

  const handlePageChange = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      page,
      offset: (page - 1) * prev.limit,
    }));
  };

  const handleViewClick = (userData: any) => {
    const data = userData as any as CurrentUser;
    setUserInView(data);
  };

  const handleModalClose = () => {
    setUserInView(null);
  };

  const handlePersonalHandleRemove = async (id: number) => {
    try {
      await removePersonalHandle(id);
      toast.success('Personal handle removed successfully');
      refetch();
    } catch (err) {
      toast.error('Something error handle while removing');
    }
  };

  const handlebizHandleRemove = async (id: number) => {
    try {
      await removeBusinessHandle(id);
      toast.success('Business handle removed successfully');
      refetch();
    } catch (err) {
      toast.error('Something error handle while removing');
    }
  };

  const cols: GridColDef[] = [
    ...UsersLIstCol,
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 100,
      width: 200,
      renderCell: cellValues => {
        return (
          <Button
            size='small'
            sx={{ textTransform: 'capitalize' }}
            variant='contained'
            color='primary'
            disabled={cellValues.row.role !== 'GUEST_USER'}
            onClick={() => handleActionClick(cellValues.row.id)}
          >
            Allow as Campaigner
          </Button>
        );
      },
    },
    {
      field: 'action2',
      headerName: 'View Details',
      minWidth: 100,
      width: 200,
      renderCell: cellValues => {
        return (
          <IconButton onClick={() => handleViewClick(cellValues.row)}>
            <RemoveRedEyeIcon fontSize='inherit' />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ height: '100%' }}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          User list
        </Typography>
        <Box sx={{ height: '500px', minHeight: 500 }}>
          <DataGrid
            rows={
              Array.isArray(allUsers?.users) ? sortBy(allUsers.users, 'id') : []
            }
            columns={cols}
            rowCount={
              typeof allUsers === 'object' &&
              allUsers !== null &&
              'count' in allUsers
                ? allUsers.count
                : 0
            }
            loading={isLoading}
            pageSize={pagination.limit}
            page={pagination.page - 1}
            paginationMode='server'
            onPageChange={newPage => handlePageChange(newPage + 1)}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog
        maxWidth={'md'}
        open={Boolean(userInview)}
        onClose={handleModalClose}
        fullWidth
      >
        <DialogTitle>User Wallet : {userInview?.hedera_wallet_id}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableCell>User Metrics</TableCell>
              <TableCell>Values</TableCell>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Personal Handle</TableCell>
                <TableCell>
                  {userInview?.personal_twitter_handle ?? 'NA'}
                  <IconButton
                    title='Remove this handle'
                    size='small'
                    color='error'
                    disabled={
                      isLoadingPersonal ||
                      !userInview?.personal_twitter_handle
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
                <TableCell>Biuieness Handle</TableCell>
                <TableCell>
                  {userInview?.business_twitter_handle ?? 'NA'}
                  <IconButton
                    title='Remove this buesness handle'
                    size='small'
                    color='error'
                    disabled={
                      isLoadingBusiness ||
                      !userInview?.business_twitter_handle
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
                <TableCell>Hbar Balance</TableCell>
                <TableCell>{userInview?.available_budget}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total reward gained</TableCell>
                <TableCell>{userInview?.total_rewarded}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsersViews;
