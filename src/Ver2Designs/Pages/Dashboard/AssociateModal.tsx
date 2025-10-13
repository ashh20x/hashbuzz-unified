import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useLazyGetTokenQuery } from '../../../API/mirrorNodeAPI';
import { useLazyGetTokenBalancesQuery } from '../../../API/user';
import { setBalances } from '../../../Store/miscellaneousStoreSlice';
import { useAppDispatch } from '../../../Store/store';
import { EntityBalances } from '../../../types';
import { useListTokenMutation } from '../../Admin/api/admin';
interface TopupModalProps {
  open: boolean;
  onClose: () => void;
}
type CurrentFormState = {
  token_id: string;
  tokendata: string;
  token_type: string;
  token_symbol: string;
  decimals: number;
};

const FORM_INITIAL_STATE: CurrentFormState = {
  token_id: '',
  tokendata: '',
  token_type: '',
  token_symbol: '',
  decimals: 0,
};

// const calculateCharge = (amt: number) => amt * 0.1;

const AssociateModal = ({ open, onClose }: TopupModalProps) => {
  const [formData, setFormData] = React.useState<CurrentFormState>({
    ...FORM_INITIAL_STATE,
  });
  const [getToken] = useLazyGetTokenQuery();
  const [addNewToken] = useListTokenMutation();
  const [getTokenBalances] = useLazyGetTokenBalancesQuery();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const getTokenInfo = async (tokenId: string) => {
    try {
      const tokenInfoReq = await getToken(tokenId).unwrap();
      const tokenInfo = tokenInfoReq.data;
      setFormData(prev => ({
        ...prev,
        token_symbol: tokenInfo.symbol,
        token_type:
          tokenInfo.type === 'FUNGIBLE_COMMON' ? 'fungible' : 'nonfungible',
        decimals: Number(tokenInfo.decimals),
      }));
    } catch (err) {
      console.error('Failed to fetch token info:', err);
    }
  };

  // console.log(formData, "formdata");
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputSelectChangeHandler = (event: SelectChangeEvent): void => {
    setFormData(prev => ({
      ...prev,
      token_type: event.target.value as string,
    }));
  };

  const onSubmitHandler = async () => {
    try {
      setLoading(true);
      const data = {
        ...formData,
        decimals: Number(formData.decimals),
      };
      const tokenInfoReq = await addNewToken(data).unwrap();
      const balancesData = await getTokenBalances().unwrap();
      const balances: EntityBalances[] = balancesData.map(d => ({
        entityBalance: d.available_balance.toFixed(4),
        entityIcon: d.token_symbol,
        entitySymbol: '',
        entityId: d.token_id,
        entityType: d.token_type,
      }));
      dispatch(setBalances(balances));
      toast.success(
        typeof tokenInfoReq?.message === 'string'
          ? tokenInfoReq.message
          : 'Token associated successfully.'
      );
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Failed to associate token:', err);
      setLoading(false);
    }
  };

  const handleTokenIdInputBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value && value.length > 6) getTokenInfo(value);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        {loading ? 'Associate in progress...' : 'Associate'}
        <IconButton
          onClick={onClose}
          color='error'
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize='inherit' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='token_id'>Token Id</InputLabel>
              <OutlinedInput
                label='Enter amount'
                type='text'
                name='token_id'
                id='token_id'
                placeholder='Enter the Token Id'
                onBlur={handleTokenIdInputBlur}
                fullWidth
                disabled={loading}
                onChange={inputChangeHandler}
                value={formData.token_id}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='decimals'>Decimals</InputLabel>
              <OutlinedInput
                label='Enter decimals'
                type='number'
                value={formData.decimals}
                name='decimals'
                id='decimals'
                placeholder='Enter the decimals'
                fullWidth
                disabled={loading}
                onChange={inputChangeHandler}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='token_symbol'>Token Symbol</InputLabel>
              <OutlinedInput
                label='Token Symbol'
                type='text'
                name='token_symbol'
                id='token_symbol'
                placeholder='Enter the Token Symbol'
                fullWidth
                disabled={loading}
                onChange={inputChangeHandler}
                value={formData.token_symbol}
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='token_type'>Token Type</InputLabel>
              <Select
                labelId='token_type'
                id='token_type'
                label='Token Type'
                onChange={inputSelectChangeHandler}
                value={formData.token_type}
              >
                <MenuItem value='fungible'>Fungible</MenuItem>
                <MenuItem value='nonfungible'>Non-Fungible</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor='tokendata'>Token Data</InputLabel>
              <OutlinedInput
                label='Enter Token Data'
                type='text'
                name='tokendata'
                id='tokendata'
                placeholder='Enter the Token Data'
                fullWidth
                disabled={loading}
                onChange={inputChangeHandler}
                value={formData.tokendata}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color='error' variant='outlined'>
          Close
        </Button>
        <Button
          onClick={onSubmitHandler}
          autoFocus
          variant='contained'
          disabled={loading}
        >
          Associate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssociateModal;
