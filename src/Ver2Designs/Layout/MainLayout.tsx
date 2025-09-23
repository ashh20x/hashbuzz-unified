import { useGetCurrentUserQuery } from '@/API/user';
import useBalancesSync from '@/hooks/use-balances-sync';
import { updateCurrentUser } from '@/Store/miscellaneousStoreSlice';
import { useAppDispatch } from '@/Store/store';
import { Container, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfirmSpinner } from '../../components/Spinners/Spinner';
import { DashboardHeader } from '../Components';

const MainLayout = () => {
  useBalancesSync();
  const theme = useTheme();
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser) {
      dispatch(updateCurrentUser(currentUser));
    }
  }, [currentUser, dispatch]);

  if (isLoading) {
    return <ConfirmSpinner />;
  }

  return (
    <>
      <DashboardHeader />
      <Container
        maxWidth='xl'
        sx={{
          // backgroundColor: '#F5F6FF'
          minHeight: '100vh',
          paddingTop: 10,
          [theme.breakpoints.up('sm')]: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            height: '100%',

            gridGap: '12px',
          },
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
