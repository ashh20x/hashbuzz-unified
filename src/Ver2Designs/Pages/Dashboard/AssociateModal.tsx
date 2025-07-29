import { Close as CloseIcon } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { useStore } from "../../../Store/StoreProvider";
import { EntityBalances } from "../../../types";
interface TopupModalProps {
  open: boolean;
  onClose: () => void;
}
type CurrentFormState = {
  token_id: string;
  tokendata: string;
  token_type: string;
  token_symbol: string;
  decimals: Number;
};

const FORM_INITIAL_STATE: CurrentFormState = {
  token_id: "",
  tokendata: "",
  token_type: "",
  token_symbol: "",
  decimals: 0,
};

// const calculateCharge = (amt: number) => amt * 0.1;

const AssociateModal = ({ open, onClose }: TopupModalProps) => {
  const [formData, setFromData] = React.useState<CurrentFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const { Admin, User, MirrorNodeRestAPI } = useApiInstance();
  const [loading, setLoading] = useState(false);
  const store = useStore();

  const getTokenInfo = async (tokenId: string) => {
    try {
      const tokenInfoReq = await MirrorNodeRestAPI.getTokenInfo(tokenId);
      const tokenInfo = tokenInfoReq.data;
      setFromData((_prev) => ({ ..._prev, token_symbol: tokenInfo.symbol, token_type: tokenInfo.type === "FUNGIBLE_COMMON" ? "fungible" : "nonfungible", decimals: +tokenInfo.decimals }));
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(formData, "formdata");
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFromData((_d) => ({
      ..._d,
      [event.target.name]: event.target.value,
    }));
  };

  const inputSelectChangeHandler = (event: any) => {
    event.preventDefault();
    setFromData((_d) => ({
      ..._d,
      token_type: event.target.value,
    }));
  };

  const onSubmitHandler = async () => {
    try {
      setLoading(true);
      const data = {
        ...formData,
        decimals: Number(formData.decimals),
      };
      const tokenInfoReq = await Admin.addNewToken(data);
      const balancesData = await User.getTokenBalances();
      const balances: EntityBalances[] = balancesData.map((d) => {
        return {
          entityBalance: d.available_balance.toFixed(4),
          entityIcon: d.token_symbol,
          entitySymbol: "",
          entityId: d.token_id,
          entityType: d.token_type,
        };
      });
      store.dispatch({ type: "SET_BALANCES", payload: balances });
      toast.success(tokenInfoReq.message);
      setLoading(false);
      onClose();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleTokenIdInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && value.length > 6) getTokenInfo(value);
  };

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
              onBlur={handleTokenIdInputBlur}
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
              value={formData.decimals}
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
            <OutlinedInput label="Token Symbol" type={"text"} name="token_symbol" id="token_symbol" placeholder="Enter the Token Symbol" fullWidth disabled={loading} onChange={inputChangeHandler} value={formData.token_symbol} />
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="token_type">Token Type</InputLabel>
            <Select labelId="token_type" id="token_type" label="Token Type" onChange={inputSelectChangeHandler} value={formData.token_type}>
              <MenuItem value={"fungible"}>Fungible</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
            <InputLabel htmlFor="tokendata">Token Data</InputLabel>
            <OutlinedInput label="Enter Token Data" type={"text"} name="tokendata" id="tokendata" placeholder="Enter the Token Data" fullWidth disabled={loading} onChange={inputChangeHandler} />
          </FormControl>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
        <Button onClick={onSubmitHandler} autoFocus variant="contained">
          Associate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssociateModal;
