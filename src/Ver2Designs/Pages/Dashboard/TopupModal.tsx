import React, { useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Grid,
  InputAdornment,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { EntityBalances, BalOperation, FormFelid } from "../../../types";
import { useSmartContractServices } from "../../../HashConnect/smartcontractService";
import { toast } from "react-toastify";
import { useHashconnectService } from "../../../HashConnect";
import { LoadingButton } from "@mui/lab";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { unstable_batchedUpdates } from "react-dom";

interface TopupModalProps {
  data: EntityBalances | null;
  open: boolean;
  onClose?: () => void;
  operation: BalOperation;
}
type CurrentFormState = {
  amount: FormFelid<number>;
};

const FORM_INITIAL_STATE: CurrentFormState = {
  amount: {
    value: 0,
    error: false,
    helperText: "Enter the amount hbar(ℏ) / Token",
  },
};

const calculateCharge = (amt: number) => amt * 0.1;
const calculateTotal = (amt: number) => amt + calculateCharge(amt);

const TopupModal = ({ data, open, onClose, operation }: TopupModalProps) => {
  const [formData, setFromData] = React.useState<CurrentFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const inputRef = React.createRef<HTMLInputElement>();
  const [loading, setLoading] = React.useState(false);

  const { topUpAccount } = useSmartContractServices();
  const { pairingData } = useHashconnectService();

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFromData((_d) => ({
      amount: {
        ..._d.amount,
        value: parseFloat(event.target.value),
      },
    }));
  };

  const handleTopup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (formData.amount.value > 0 && data?.entityType && pairingData?.accountIds) {
        const value = parseFloat(formData.amount.value.toFixed(4));
        const fee = parseFloat(calculateCharge(value).toFixed(4));
        const total = parseFloat(calculateTotal(value).toFixed(4));
        const req = await topUpAccount({
          entityType: data?.entityType,
          entityId: data?.entityId,
          amount: { value, fee, total },
          senderId: pairingData?.accountIds[0],
        });
        console.log(req);
        if (req?.success) {
          toast.success("Transaction successfully completed.");
        }

        if (req?.error) {
          toast.error(req.error === "USER_REJECT" ? "Payment request rejected by user" : req.error);
        }
        unstable_batchedUpdates(() => {
          setLoading(false);
          setFromData(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
        });

        if (onClose) onClose();
      } else {
        toast.warning("Please Enter the valid amount to topup");
      }
    } catch (err) {
      setLoading(false);
      setFromData(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
    }
  };

  const modalClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFromData(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
    if (onClose) onClose();
  };

  //auto focus to input
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  return (
    <Dialog open={open}>
      <DialogTitle>
        {loading? "Payment in progress...":`Top wallet with ${data?.entityType === "HBAR" ? "hbar(ℏ)" : `token ${data?.entityIcon}`}`}
        <IconButton
          onClick={modalClose}
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
        <Box sx={{ marginTop: 0.5, marginBottom: 2.5 }}>
          <Typography variant="caption">Notes: </Typography>
          <List dense>
            <ListItem>
              <Typography variant="caption"> The specified amount excludes Hedera network fee</Typography>
            </ListItem>
            {operation === "topup" ? (
              <React.Fragment>
                <ListItem>
                  <Typography variant="caption"> The specified amount can be used over multiple campaigns</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="caption">Hashbuzz applies 10% charge fee on top of the specified amount</Typography>
                </ListItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ListItem>
                  <Typography variant="caption"> reimbursements are free of charge</Typography>
                </ListItem>
              </React.Fragment>
            )}
          </List>
        </Box>
        {operation === "topup" ? (
          <Grid container spacing={1}>
            <Grid item md={5}>
              <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
                <InputLabel htmlFor="topup-amount-input">Amount</InputLabel>
                <OutlinedInput
                  label="Enter amount"
                  type={"number"}
                  ref={inputRef}
                  name="Topup Amount"
                  id="topup-amount-input"
                  placeholder="Enter the Topup amount"
                  fullWidth
                  disabled={loading}
                  error={formData.amount.error}
                  value={formData.amount.value}
                  endAdornment={<InputAdornment position="end">{data?.entityIcon}</InputAdornment>}
                  onChange={inputChangeHandler}
                />
                <FormHelperText error={formData.amount.error}>{formData.amount.helperText}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={3}>
              <Stack height={"100%"} alignItems={"center"} sx={{ paddingTop: 2.75 }}>
                {"+ (of 10%)"}
              </Stack>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth sx={{ marginBottom: 1.25 }}>
                <InputLabel htmlFor="hashbuzz-charge-input">Charge</InputLabel>
                <OutlinedInput
                  label="Hashbuzz chnarge"
                  type={"number"}
                  name="Charge"
                  id="hashbuzz-charge-input"
                  placeholder="00.00"
                  fullWidth
                  value={calculateCharge(formData.amount.value).toFixed(4)}
                  endAdornment={<InputAdornment position="end">{data?.entityIcon}</InputAdornment>}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={12}>
              <Divider />
            </Grid>

            <Grid item md={9} sx={{ textAlign: "right", paddingRight: 3 }}>
              <Typography color="grey">Total:</Typography>
            </Grid>
            <Grid item md={3} sx={{ textAlign: "right", paddingRight: 2.25 }}>
              <Typography variant="subtitle1"> {calculateTotal(formData.amount.value).toFixed(4)}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Box>
            <FormControl fullWidth sx={{ marginBottom: 1.25 }} required>
              <InputLabel htmlFor="reimburse-amount-input">Reimburse Amount</InputLabel>
              <OutlinedInput
                label="Enter amount"
                type={"number"}
                ref={inputRef}
                name="Reimburse Amount"
                id="reimburse-amount-input"
                placeholder="Enter the Topup amount"
                fullWidth
                error={formData.amount.error}
                value={formData.amount.value}
                endAdornment={<InputAdornment position="end">{data?.entityIcon}</InputAdornment>}
                onChange={inputChangeHandler}
              />
              <FormHelperText error={formData.amount.error}>{formData.amount.helperText}</FormHelperText>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {/* <Button autoFocus onClick={modalClose} color="error" variant="outlined">
          Close
        </Button> */}
        {operation === "reimburse" ? (
          <Button>Reimburse</Button>
        ) : (
          <LoadingButton
            autoFocus
            onClick={handleTopup}
            variant="contained"
            loading={loading}
            loadingPosition="start"
            startIcon={<AccountBalanceWalletIcon />}
            disabled={loading}
          >
            Topup<i>{` ( ${calculateTotal(formData.amount.value).toFixed(4)}  ${data?.entityIcon} )`}</i>
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TopupModal;
