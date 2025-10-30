import { useLazyGetBalancesForAccountIdQuery } from '@/API/mirrorNodeAPI';
import { useAppSelector } from '@/Store/store';
import {
  AddCircle,
  ArrowBackIos,
  ArrowForwardIos,
  RemoveCircle,
} from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  Grow,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import React, { useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from 'react-toastify';
import {
  isAllowedToCmapigner,
  isAnyBalancesIsAvailable,
} from '../../../comman/helpers';
import { cardStyle } from '../../../components/Card/Card.styles';
import HederaIcon from '../../../SVGR/HederaIcon';
import { BalOperation, EntityBalances } from '../../../types';
import TopupModal from './TopupModal';

const formatBalance = (balObj: EntityBalances): string => {
  if (!balObj) return '';
  const { entityBalance, entityType } = balObj;
  return entityType === 'HBAR'
    ? (parseFloat(entityBalance) / 1e8).toFixed(4)
    : entityBalance;
};

const BalanceCard = ({
  entityBal,
  entityIcon,
}: {
  entityBal: string | number;
  entityIcon: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Stack
      direction='row'
      component={Card}
      elevation={0}
      sx={{
        p: 0.5,
        display: 'inline-flex',
        m: '0 auto',
        borderRadius: 0,
        border: 1,
        borderColor: theme.palette.primary.main,
      }}
    >
      <Avatar
        variant='rounded'
        sx={{ width: 'auto', height: 'auto', p: '5px', fontSize: '0.875rem' }}
      >
        {entityIcon ?? 'HBAR'}
      </Avatar>
      <Stack spacing={0.25} sx={{ ml: 0.5, mr: 0.5 }}>
        <Typography fontWeight={500} sx={{ textAlign: 'center' }}>
          {entityBal ?? '124.5678'}
        </Typography>
      </Stack>
    </Stack>
  );
};

const Balances = () => {
  const theme = useTheme();
  const aboveXs = useMediaQuery(theme.breakpoints.up('sm'));
  const { balances, currentUser } = useAppSelector(s => s.app);
  const [activeIndex, setActiveIndex] = useState(0);
  const [topupModalData, setTopupModalData] = useState<EntityBalances | null>(
    null
  );
  const [balanceList, setBalanceList] = useState<{ operation: BalOperation }>({
    operation: 'topup',
  });
  const topUpButtonsListRef = useRef<HTMLDivElement>(null);
  const [triggerGetBalancesForAccountId] =
    useLazyGetBalancesForAccountIdQuery();
  const [entityListEl, setEntityEl] = useState<HTMLElement | null>(null);

  const entityListOpen = Boolean(entityListEl);

  const handleBalanceNavigator = (navigate: 'next' | 'prev') => {
    setActiveIndex(index => {
      const length = balances!.length;
      if (navigate === 'next') return index < length - 1 ? index + 1 : 0;
      return index > 0 ? index - 1 : length - 1;
    });
  };

  const handleCloseEntityList = (event: Event) => {
    if (
      topUpButtonsListRef.current &&
      topUpButtonsListRef.current.contains(event.target as HTMLElement)
    )
      return;
    setEntityEl(null);
  };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    const entity = balances![index];
    if (balanceList.operation === 'topup') {
      const accountId = currentUser?.hedera_wallet_id;
      if (accountId) {
        const accountBalReq =
          await triggerGetBalancesForAccountId(accountId).unwrap();
        const accountBal = accountBalReq.balances.find(
          b => b.account === accountId
        );

        if (entity.entityType === 'HBAR') {
          if (accountBal?.balance) setTopupModalData(entity);
          else toast.warning('Insufficient fund to the account.');
        } else {
          const tokenBalance = accountBal?.tokens.find(
            t => t.token_id === entity.entityId
          );
          if (tokenBalance && tokenBalance.balance > 0) {
            setTopupModalData(entity);
          } else {
            toast.warning(
              `Paired account have insufficient token balance for the token ${entity?.entityIcon}.`
            );
          }
        }
      }
      setBalanceList(_d => ({ ..._d, open: false }));
    } else {
      unstable_batchedUpdates(() => {
        setTopupModalData(entity);
        setBalanceList(_d => ({ ..._d, open: false }));
      });
    }
  };

  const handleTopupOrReimClick = (
    operation: BalOperation,
    event?: React.MouseEvent
  ) => {
    unstable_batchedUpdates(() => {
      setBalanceList({ operation });
      setEntityEl(
        event ? (event.target as HTMLElement) : topUpButtonsListRef.current
      );
    });
  };

  const topUpButtons = [
    <Button
      key='reimburse'
      startIcon={<RemoveCircle />}
      disabled={!isAllowedToCmapigner(currentUser?.role)}
      title='Reimburse from hashbuzz contract to your wallet'
      onClick={() => handleTopupOrReimClick('reimburse')}
    />,
    <Button
      key='top-up'
      disabled={!isAllowedToCmapigner(currentUser?.role)}
      startIcon={<AddCircle />}
      onClick={() => handleTopupOrReimClick('topup')}
      title='Topup your hashbuzz account for the campaign'
    />,
  ];

  return (
    <>
      <Grid size={{ xs: 6, sm: 6, xl: 3, lg: 3 }}>
        <Card elevation={0} sx={cardStyle}>
          <Stack
            direction={aboveXs ? 'row' : 'column'}
            alignItems={aboveXs ? 'flex-start' : 'normal'}
            sx={{ height: '100%', width: '100%', overflowY: 'auto' }}
          >
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='center'
              sx={{
                color: 'rgba(82, 102, 255, 0.5)',
                height: '100%',
                pr: aboveXs ? 2 : 0,
                pb: aboveXs ? 0 : 2,
                fontSize: 48,
              }}
            >
              <HederaIcon
                fill='#fff'
                fillBg='rgba(82, 102, 255, 0.5)'
                size={48}
              />
            </Stack>
            <Divider orientation={aboveXs ? 'vertical' : 'horizontal'} />
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: 0,
                maxWidth: '100%',
                textAlign: 'left',
                px: 1,
              }}
            >
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                sx={{ mb: 2, height: 30 }}
              >
                <Typography variant='h6' sx={{ lineHeight: 1 }}>
                  Balances
                </Typography>
                {balances && balances.length > 0 && (
                  <ButtonGroup
                    size='small'
                    aria-label='Balance update group'
                    sx={{
                      '.MuiButton-startIcon': { m: 0 },
                      justifyContent: 'center',
                    }}
                    ref={topUpButtonsListRef}
                  >
                    {topUpButtons}
                  </ButtonGroup>
                )}
              </Stack>
              {balances && isAnyBalancesIsAvailable(balances) ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ButtonGroup
                    size='small'
                    aria-label='Balance display card'
                    sx={{
                      '.MuiButton-startIcon': { m: 0 },
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      key='next_button'
                      startIcon={<ArrowBackIos />}
                      disabled={activeIndex === 0}
                      onClick={() => handleBalanceNavigator('prev')}
                    />
                    <BalanceCard
                      entityBal={formatBalance(balances[activeIndex])}
                      entityIcon={balances[activeIndex]?.entityIcon}
                      key='balance_card'
                    />
                    <Button
                      key='prev_button'
                      startIcon={<ArrowForwardIos />}
                      disabled={activeIndex === balances.length - 1}
                      onClick={() => handleBalanceNavigator('next')}
                    />
                  </ButtonGroup>
                </Box>
              ) : (
                <Stack sx={{ mt: 3 }} direction='row' justifyContent='center'>
                  <Button
                    variant='contained'
                    disableElevation
                    sx={{ width: 120, m: '0  auto' }}
                    startIcon='ℏ'
                    disabled={!isAllowedToCmapigner(currentUser?.role)}
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={event => handleTopupOrReimClick('topup', event)}
                  >
                    Topup
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
          <Popper
            sx={{ zIndex: 1 }}
            open={entityListOpen}
            anchorEl={entityListEl}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseEntityList}>
                    <MenuList id='entityList-for-topup' autoFocusItem>
                      {balances &&
                        balances.map((bal, index) => (
                          <MenuItem
                            key={index}
                            disabled={!isAllowedToCmapigner(currentUser?.role)}
                            onClick={event => handleMenuItemClick(event, index)}
                          >
                            <ListItemAvatar>{bal?.entityIcon}</ListItemAvatar>
                            <ListItemText>
                              {formatBalance(bal)} {`${bal.entitySymbol} `}
                            </ListItemText>
                            {balanceList.operation === 'reimburse' && (
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                (max)
                              </Typography>
                            )}
                          </MenuItem>
                        ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Card>
      </Grid>
      <TopupModal
        data={topupModalData}
        open={Boolean(topupModalData)}
        onClose={() => setTopupModalData(null)}
        operation={balanceList.operation}
      />
    </>
  );
};

export default Balances;
