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
import { useSmartContractServices } from "../../../Wallet/smartcontractService";
import { toast } from "react-toastify";
import { useHashconnectService } from "../../../Wallet";
import { LoadingButton } from "@mui/lab";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { unstable_batchedUpdates } from "react-dom";
import { transactionData } from "../../../Data/InvoiceTransactions";
import { useApiInstance } from "../../../APIConfig/api";
import { getErrorMessage } from "../../../Utilities/helpers";
import { useStore } from "../../../Store/StoreProvider";
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
  entityBalance: "00.00",
  entityIcon: "ℏ",
  entitySymbol: "ℏ",
  entityId: "",
  entityType: "HBAR",
};

const FORM_INITIAL_STATE: CurrentFormState = {
  amount: {
    value: 0,
    error: false,
    helperText: "",
  },
};

const calculateCharge = (amt: number) => amt * 0.1;
const calculateTotal = (amt: number) => amt + calculateCharge(amt);

const TopupModal = ({ data, open, onClose, operation }: TopupModalProps) => {
  const [formData, setFromData] = React.useState<CurrentFormState>(JSON.parse(JSON.stringify(FORM_INITIAL_STATE)));
  const inputRef = React.createRef<HTMLInputElement>();
  const [loading, setLoading] = React.useState(false);
  const { User } = useApiInstance();

  const { topUpAccount } = useSmartContractServices();
  const { pairingData } = useHashconnectService();
  const { Transaction } = useApiInstance();
  const store = useStore();
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
          decimals: data?.decimals
        });
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
        setLoading(false);
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
  const reimburse = async () => {
    setLoading(true);
    try {
      const response = await Transaction.reimburseAmount({ type: data?.entityType?.toUpperCase(), token_id: data?.entityId, amount: formData?.amount?.value });
      const currentUser = await User.getCurrentUser();
      store?.updateState((prev) => {
        return {
          ...prev,
          currentUser: currentUser,
          balances: [
            {
              ...INITIAL_HBAR_BALANCE_ENTITY,
              entityBalance: (currentUser?.available_budget ?? 0 / 1e8).toFixed(4),
              entityId: currentUser?.hedera_wallet_id ?? "",
            },
          ],
        };
      });
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
      toast.info(response?.message);
      setLoading(false);
      if (onClose) onClose();
    } catch (err: any) {
      toast.error(err);
      setLoading(false);
    }
  };
  console.log(data, 'data')

  return (
    <Dialog open={open}>
      <DialogTitle>
        {loading ? "Payment in progress..." : `${operation === 'topup' ? " Add funds from your wallet" : "Refund to your wallet"} ${data?.entityType === "HBAR" ? "hbar(ℏ)" : `(token ${data?.entityIcon})`}`}
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
          <Typography variant="caption">Remarks: </Typography>
          <List dense>
            {operation === "topup" ? (
              <React.Fragment>
                <ListItem>
                  <Typography variant="caption">The stated amount does not include Hedera network fees.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="caption">The stated amount can be allocated across various campaigns.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="caption">Hashbuzz imposes a 10% service fee on the designated amount.
                  </Typography>
                </ListItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ListItem>
                  <Typography variant="caption"> The stated amount does not include Hedera network fees.</Typography>

                </ListItem>
                <ListItem>
                  <Typography variant="caption"> Refunds are provided at no cost.</Typography>
                </ListItem>
                {/* <ListItem>
                  <Typography variant="caption"> reimbursements are free of charge</Typography>
                </ListItem> */}
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
                {"+ (10%)"}
              </Stack>
            </Grid>
            <Grid item md={4}>
              <FormControl fullWidth sx={{ marginBottom: 1.25 }}>
                <InputLabel htmlFor="hashbuzz-charge-input">Fees</InputLabel>
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
          <LoadingButton onClick={reimburse} autoFocus variant="contained" loading={loading} loadingPosition="start" disabled={loading}>
            Reimburse
          </LoadingButton>
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
