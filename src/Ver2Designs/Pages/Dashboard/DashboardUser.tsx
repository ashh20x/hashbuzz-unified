import { useLazyGetTwitterBizHandleQuery } from '@/API/integration';
import { useAppSelector } from '@/Store/store';
import { LinkOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessIcon from '@mui/icons-material/Business';
import { Alert, Button, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import XPlatformIcon from '../../../SVGR/XPlatformIcon';
import { getErrorMessage, isAllowedToCmapigner } from '../../../comman/helpers';
import Balances from './Balances';
import CampaignList from './CampaignList';
import { CardGenUtility } from './CardGenUtility';
import * as SC from './styled';

const Dashboard = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const [getTwitterBizHandle, { isLoading: isLoadingBizHandle }] =
    useLazyGetTwitterBizHandleQuery();
  const location = useLocation();

  const bizHandleIntegration = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      try {
        event.preventDefault();
        const { url } = await getTwitterBizHandle().unwrap();
        window.location.href = url;
      } catch (err) {
        console.error('Error during brand handle integration:', err);
        toast.error(
          getErrorMessage(err) ??
            'Error while requesting personal handle integration.'
        );
      }
    },
    [getTwitterBizHandle]
  );

  const errorFromState = location.state?.error;

  return (
    <React.Fragment>
      {errorFromState && (
        <Alert severity='error' sx={{ mb: 2, mt: 2 }}>
          {errorFromState}
        </Alert>
      )}
      <SC.StyledCardGenUtility>
        <CardGenUtility
          startIcon={
            <AccountBalanceWalletIcon color='inherit' fontSize={'inherit'} />
          }
          title={'Hedera Account ID'}
          content={
            <Typography variant='h5'>
              {currentUser?.hedera_wallet_id}
            </Typography>
          }
        />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<XPlatformIcon color='inherit' size={40} />}
          title={'Personal 𝕏 Account'}
          content={
            <Typography variant='h5'>
              {'@' + currentUser?.personal_twitter_handle}
            </Typography>
          }
        />

        {/* card for Brand twitter handle */}
        <CardGenUtility
          startIcon={<BusinessIcon color='inherit' fontSize={'inherit'} />}
          title={'Brand 𝕏 Account'}
          content={
            currentUser?.business_twitter_handle ? (
              <Typography variant='h5'>
                {'@' + currentUser?.business_twitter_handle}
              </Typography>
            ) : (
              <Button
                endIcon={<LinkOff fontSize='inherit' />}
                variant='outlined'
                onClick={bizHandleIntegration}
                loading={isLoadingBizHandle}
                disabled={!isAllowedToCmapigner(currentUser?.role)}
              >
                Connect
              </Button>
            )
          }
        />

        {/* Card for account balance */}
        <Balances />
        {/* </Grid> */}
      </SC.StyledCardGenUtility>

      {/* Campaign List section */}
      <CampaignList />
    </React.Fragment>
  );
};

export default Dashboard;
