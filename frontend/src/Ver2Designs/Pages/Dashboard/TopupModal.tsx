import { useReimburseAmountMutation } from '@/API/transaction';
import {
  useLazyGetCurrentUserQuery,
  useLazyGetTokenBalancesQuery,
} from '@/API/user';
import {
  setBalances,
  updateCurrentUser,
} from '@/Store/miscellaneousStoreSlice';
import { useAppDispatch, useAppSelector } from '@/Store/store';
import { useSmartContractServices } from '@/Wallet';
import { useAccountId } from '@buidlerlabs/hashgraph-react-wallets';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from 'react-toastify';
import { BalOperation, EntityBalances, FormFelid } from '../../../types';

interface TopupModalProps {
  data: EntityBalances | null;
  open: boolean;
  onClose?: () => void;
  operation: BalOperation;
}

type CurrentFormState = {
  amount: FormFelid<number>;
};

const INITIAL_HBAR_BALANCE_ENTITY = {
  entityBalance: '00.00',
  entityIcon: 'ℏ',
  entitySymbol: 'ℏ',
  entityId: '',
  entityType: 'HBAR',
} as const;

const FORM_INITIAL_STATE: CurrentFormState = {
  amount: {
    value: 0,
    error: false,
    helperText: '',
  },
} as const;

// Memoized calculations
const calculateCharge = (amt: number): number => amt * 0.1;
const calculateTotal = (amt: number): number => amt + calculateCharge(amt);

const getTheBalOfEntity = (
  balances: EntityBalances[],
  tokenId: string
): number => {
  const bal = balances.find(en => en.entityId === tokenId)?.entityBalance;
  return bal ? +bal : 0;
};

const TopupModal = ({ data, open, onClose, operation }: TopupModalProps) => {
  const [formData, setFormData] =
    useState<CurrentFormState>(FORM_INITIAL_STATE);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { topUpAccount } = useSmartContractServices();
  const { data: accountId } = useAccountId();
  const { balances } = useAppSelector(s => s.app);
  const dispatch = useAppDispatch();

  const [reimburseAmount] = useReimburseAmountMutation();
  const [getTokenBalances] = useLazyGetTokenBalancesQuery();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  // Memoized calculations for form values
  const calculatedFee = useMemo(
    () => calculateCharge(formData.amount.value),
    [formData.amount.value]
  );

  const calculatedTotal = useMemo(
    () => calculateTotal(formData.amount.value),
    [formData.amount.value]
  );

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const value = parseFloat(event.target.value) || 0;
      setFormData(prev => ({
        amount: {
          ...prev.amount,
          value,
          error: value < 0,
          helperText: value < 0 ? 'Amount cannot be negative' : '',
        },
      }));
    },
    []
  );

  const handleTopup = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (formData.amount.value <= 0) {
        toast.warning('Please Enter a valid amount to topup');
        return;
      }

      if (!data?.entityType || !accountId) {
        toast.error('Missing required data for transaction');
        return;
      }

      setLoading(true);

      try {
        const value = parseFloat(formData.amount.value.toFixed(4));
        const fee = parseFloat(calculatedFee.toFixed(4));
        const total = parseFloat(calculatedTotal.toFixed(4));

        const req = await topUpAccount({
          entityType: data.entityType,
          entityId: data.entityId,
          amount: { value, fee, total },
          senderId: accountId,
          decimals: data.decimals,
        });

        if (req?.success) {
          toast.success('Transaction successfully completed.');
          onClose?.();
        } else {
          toast.error('Transaction failed. Please try again.');
        }
      } catch (err: any) {
        console.error('Topup error:', err);
        toast.error(err?.message || 'Transaction failed. Please try again.');
      } finally {
        unstable_batchedUpdates(() => {
          setLoading(false);
          setFormData(FORM_INITIAL_STATE);
        });
      }
    },
    [
      formData.amount.value,
      data,
      accountId,
      calculatedFee,
      calculatedTotal,
      topUpAccount,
      onClose,
    ]
  );

  const modalClose = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setFormData(FORM_INITIAL_STATE);
      onClose?.();
    },
    [onClose]
  );

  const reimburse = useCallback(async () => {
    if (!data?.entityId || !balances) {
      toast.error('Missing required data for reimburse');
      return;
    }

    if (formData.amount.value > getTheBalOfEntity(balances, data.entityId)) {
      toast.error('Wrong amount entered.');
      return;
    }

    setLoading(true);

    try {
      const response = await reimburseAmount({
        type: data.entityType?.toUpperCase(),
        token_id: data.entityId,
        amount: formData.amount.value,
      }).unwrap();

      const [currentUser, balancesData] = await Promise.all([
        getCurrentUser().unwrap(),
        getTokenBalances().unwrap(),
      ]);

      const newBalances: EntityBalances[] = [
        {
          ...INITIAL_HBAR_BALANCE_ENTITY,
          entityBalance: ((currentUser?.available_budget ?? 0) / 1e8).toFixed(
            4
          ),
          entityId: currentUser?.hedera_wallet_id ?? '',
        },
        ...balancesData.map(d => ({
          entityBalance: d.available_balance.toFixed(4),
          entityIcon: d.token_symbol,
          entitySymbol: '',
          entityId: d.token_id,
          entityType: d.token_type,
        })),
      ];

      dispatch(updateCurrentUser(currentUser));
      dispatch(setBalances(newBalances));
      toast.info(response.message);
      onClose?.();
    } catch (err: unknown) {
      console.error('Reimburse error:', err);
      toast.error(err?.message || 'Reimburse failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    data,
    balances,
    formData.amount.value,
    reimburseAmount,
    getCurrentUser,
    getTokenBalances,
    dispatch,
    onClose,
  ]);

  // Auto focus to input
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Memoized remarks content
  const remarksContent = useMemo(() => {
    if (operation === 'topup') {
      return (
        <>
          <ListItem>
            <Typography variant='caption'>
              The stated amount does not include Hedera network fees.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant='caption'>
              The stated amount can be allocated across various campaigns.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant='caption'>
              Hashbuzz imposes a 10% service fee on the designated amount.
            </Typography>
          </ListItem>
        </>
      );
    }

    return (
      <>
        <ListItem>
          <Typography variant='caption'>
            The stated amount does not include Hedera network fees.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant='caption'>
            Refunds are provided at no cost.
          </Typography>
        </ListItem>
      </>
    );
  }, [operation]);

  return (
    <Dialog open={open} maxWidth='sm' fullWidth>
      <DialogTitle>
        {loading
          ? 'Payment in progress...'
          : `${operation === 'topup' ? 'Add funds from your wallet' : 'Refund to your wallet'} ${
              data?.entityType === 'HBAR'
                ? 'hbar(ℏ)'
                : `(token ${data?.entityIcon})`
            }`}
        <IconButton
          onClick={modalClose}
          color='error'
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ marginTop: 0.5, marginBottom: 2.5 }}>
          <Typography variant='caption'>Remarks: </Typography>
          <List dense>{remarksContent}</List>
        </Box>

        {operation === 'topup' ? (
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 5 }}>
              <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
                <InputLabel htmlFor='topup-amount-input'>Amount</InputLabel>
                <OutlinedInput
                  label='Enter amount'
                  type='number'
                  ref={inputRef}
                  name='Topup Amount'
                  id='topup-amount-input'
                  placeholder='Enter the Topup amount'
                  fullWidth
                  disabled={loading}
                  error={formData.amount.error}
                  value={formData.amount.value || ''}
                  endAdornment={
                    <InputAdornment position='end'>
                      {data?.entityIcon}
                    </InputAdornment>
                  }
                  onChange={inputChangeHandler}
                />
                <FormHelperText error={formData.amount.error}>
                  {formData.amount.helperText}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Stack
                height='100%'
                alignItems='center'
                sx={{ paddingTop: 2.75 }}
              >
                + (10%)
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth sx={{ marginBottom: 1.25 }}>
                <InputLabel htmlFor='hashbuzz-charge-input'>Fees</InputLabel>
                <OutlinedInput
                  label='Hashbuzz charge'
                  type='number'
                  name='Charge'
                  id='hashbuzz-charge-input'
                  placeholder='00.00'
                  fullWidth
                  value={calculatedFee.toFixed(4)}
                  endAdornment={
                    <InputAdornment position='end'>
                      {data?.entityIcon}
                    </InputAdornment>
                  }
                  readOnly
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 9 }} sx={{ textAlign: 'right', paddingRight: 3 }}>
              <Typography color='grey'>Total:</Typography>
            </Grid>

            <Grid
              size={{ xs: 3 }}
              sx={{ textAlign: 'right', paddingRight: 2.25 }}
            >
              <Typography variant='subtitle1'>
                {calculatedTotal.toFixed(4)}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='reimburse-amount-input'>
                Reimburse Amount
              </InputLabel>
              <OutlinedInput
                label='Enter amount'
                type='number'
                ref={inputRef}
                name='Reimburse Amount'
                id='reimburse-amount-input'
                placeholder='Enter the reimburse amount'
                fullWidth
                error={formData.amount.error}
                value={formData.amount.value || ''}
                endAdornment={
                  <InputAdornment position='end'>
                    {data?.entityIcon}
                  </InputAdornment>
                }
                onChange={inputChangeHandler}
              />
              <FormHelperText error={formData.amount.error}>
                {formData.amount.helperText}
              </FormHelperText>
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {operation === 'reimburse' ? (
          <Button
            onClick={reimburse}
            autoFocus
            variant='contained'
            disabled={loading || formData.amount.value <= 0}
          >
            {loading ? 'Processing...' : 'Reimburse'}
          </Button>
        ) : (
          <Button
            autoFocus
            onClick={handleTopup}
            variant='contained'
            startIcon={<AccountBalanceWalletIcon />}
            disabled={loading || formData.amount.value <= 0}
          >
            {loading
              ? 'Processing...'
              : `Topup (${calculatedTotal.toFixed(4)} ${data?.entityIcon})`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TopupModal;
