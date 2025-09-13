import { useLazyGetTwitterBizHandleQuery } from '@/API/integration';
import { useAppSelector } from '@/Store/store';
import { Close, LinkOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BusinessIcon from '@mui/icons-material/Business';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { images } from '../../../IconsPng/image';
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
  const [showBanner, setShowBanner] = React.useState(true);

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
        <SC.StyledAlert severity='error'>{errorFromState}</SC.StyledAlert>
      )}

      {/* Promo Banner */}
      {showBanner && (
        <SC.StyledPromoBanner>
          {/* Left side: Image + Text */}
          <SC.StyledBannerLeftSide>
            <SC.StyledSpeakerImage src={images.speaker} alt='speaker_image' />

            <Box>
              <Typography variant='body2' component={SC.StyledBannerSubtitle}>
                Tap into Web3 audiences
              </Typography>
              <Typography variant='h6' component={SC.StyledBannerTitle}>
                Have a brand? Want to promote it?
              </Typography>
            </Box>
          </SC.StyledBannerLeftSide>

          <SC.StyledBannerRightSide>
            <SC.StyledCampaignerButton variant='contained'>
              Become a Campaigner
            </SC.StyledCampaignerButton>
            <SC.StyledCloseIconButton
              onClick={() => setShowBanner(false)}
              size='small'
            >
              <Close />
            </SC.StyledCloseIconButton>
          </SC.StyledBannerRightSide>
        </SC.StyledPromoBanner>
      )}

      <SC.StyledCardGenUtility>
        {/* Hedera Account ID Card */}
        <CardGenUtility
          startIcon={
            <AccountBalanceWalletIcon color='inherit' fontSize={'inherit'} />
          }
          title={'Hedera Account ID'}
          content={{
            texts: [
              currentUser?.hedera_wallet_id || 'Not Connected',
              'Make sure to fund your account with some HBARs to run campaigns',
            ],
          }}
        />

        {/* Personal Twitter Handle Card */}
        <CardGenUtility
          startIcon={<XPlatformIcon color='inherit' size={30} />}
          title={'Personal ð• Account'}
          content={{
            image: currentUser?.profile_image_url,
            texts: [
              `@${currentUser?.personal_twitter_handle || 'Not Connected'}`,
              currentUser?.name ? `${currentUser.name}` : 'Personal Account',
            ],
          }}
        />

        {/* Brand Twitter Handle Card */}
        <CardGenUtility
          startIcon={<BusinessIcon color='inherit' fontSize={'inherit'} />}
          title={'Brand ð• Account'}
          content={{
            texts: currentUser?.business_twitter_handle
              ? [
                  `@${currentUser.business_twitter_handle}`,
                  'Brand Account Connected',
                ]
              : [
                  'Not Connected',
                  'Connect your brand account to create campaigns',
                ],
          }}
        />

        {/* Account Balance Card */}
        <Balances />
      </SC.StyledCardGenUtility>

      {/* Brand Account Connection Button (if not connected) */}
      {!currentUser?.business_twitter_handle && (
        <SC.StyledBrandAccountContainer>
          <SC.StyledConnectBrandButton
            endIcon={<LinkOff fontSize='inherit' />}
            variant='contained'
            onClick={bizHandleIntegration}
            disabled={
              isLoadingBizHandle || !isAllowedToCmapigner(currentUser?.role)
            }
          >
            {isLoadingBizHandle ? 'Connecting...' : 'Connect Brand Account'}
          </SC.StyledConnectBrandButton>
        </SC.StyledBrandAccountContainer>
      )}

      {/* Campaign List section */}
      <CampaignList />
    </React.Fragment>
  );
};

export default Dashboard;
