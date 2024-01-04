import { Close as CloseIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Store/StoreProvider";
interface TopupModalProps {
  open: boolean;
  onClose: () => void;
}
type CurrentFormState = {
  token_id: string,
  tokendata: string,
  token_type: string,
  token_symbol: string,
  decimals: Number
};


const FORM_INITIAL_STATE: CurrentFormState = {
  token_id: '',
  tokendata: '',
  token_type: '',
  token_symbol: '',
  decimals: 0
};

// const calculateCharge = (amt: number) => amt * 0.1;

const AssociateModal = ({ open, onClose }: TopupModalProps) => {
  const [formData, setFromData] = React.useState<CurrentFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const { Admin, User } = useApiInstance();
  const [loading, setLoading] = useState(false)
  const store = useStore();

  console.log(formData, 'formdata')
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFromData((_d) => ({

      ..._d,
      [event.target.name]: (event.target.value),

    }));
  };
  const inputSelectChangeHandler = (event: any) => {
    event.preventDefault();
    setFromData((_d) => ({
      ..._d,
      "token_type": (event.target.value),

    }));
  };

  const onSubmitHandler = async () => {
    try {
      setLoading(true)
      const data = {
        ...formData,
        decimals: Number(formData.decimals)
      };
      const tokenInfoReq = await Admin.addNewToken(data);
      const balancesData = await User.getTokenBalances();
      store?.updateState((_state) => {
        if (balancesData.length > 0) {
          for (let index = 0; index < balancesData.length; index++) {
            const d = balancesData[index];
            _state.balances.push({
              entityBalance: d.available_balance.toFixed(4),
              entityIcon: d.token_symbol,
              entitySymbol: "",
              entityId: d.token_id,
              entityType: d.token_type,
            });
          }
        }
        return { ..._state };
      });

      toast.success(tokenInfoReq.message);
      setLoading(false)
      onClose();

    } catch (err) {
      console.log(err);
      setLoading(false)
    }

  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        {loading ? "Associate in progress..." : `Associate`}
        <IconButton
          onClick={onClose}
          color="error"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid item md={5}>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="token_id">Token Id</InputLabel>
            <OutlinedInput
              label="Enter amount"
              type={"text"}
              //   ref={inputRef}
              name="token_id"
              id="token_id"
              placeholder="Enter the Token Id"
              fullWidth
              disabled={loading}

              onChange={inputChangeHandler}
            />
          </FormControl>
        </Grid>
        <Grid item md={5}>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="decimals">Decimals</InputLabel>
            <OutlinedInput
              label="Enter decimals"
              type={"number"}
              //   ref={inputRef}
              name="decimals"
              id="decimals"
              placeholder="Enter the decimals"
              fullWidth
              disabled={loading}
              onChange={inputChangeHandler}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="token_symbol">Token Symbol</InputLabel>
            <OutlinedInput
              label="Token Symbol"
              type={"text"}
              name="token_symbol"
              id="token_symbol"
              placeholder="Enter the Token Symbol"
              fullWidth
              disabled={loading}

              onChange={inputChangeHandler}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="token_type">Token Type</InputLabel>
            <Select
              labelId="token_type"
              id="token_type"
              label="Token Type"

              onChange={inputSelectChangeHandler}
            >
              <MenuItem value={'fungible'}>Fungible</MenuItem>

            </Select>

          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="tokendata">Token Data</InputLabel>
            <OutlinedInput
              label="Enter Token Data"
              type={"text"}

              name="tokendata"
              id="tokendata"
              placeholder="Enter the Token Data"
              fullWidth
              disabled={loading}

              onChange={inputChangeHandler}
            />

          </FormControl>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
        <LoadingButton onClick={onSubmitHandler} autoFocus variant="contained"  >
          Associate
        </LoadingButton>

      </DialogActions>
    </Dialog>
  );
};

export default AssociateModal;
