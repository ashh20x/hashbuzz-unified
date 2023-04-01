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

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFromData((_d) => ({
      amount: {
        ..._d.amount,
        value: parseFloat(event.target.value),
      },
    }));
  };

  const handleTopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
        {`Top wallet with ${data?.entityType === "HBAR" ? "hbar(ℏ)" : `token ${data?.entityIcon}`}`}
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
                  error={formData.amount.error}
                  value={formData.amount.value}
                  endAdornment={<InputAdornment position="end">{data?.entityIcon}</InputAdornment>}
                  onChange={inputChangeHandler}
                />
                <FormHelperText error={formData.amount.error}>{formData.amount.helperText}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid md={3}>
              <Stack height={"100%"} alignItems={"center"} sx={{ paddingTop: 2.75 }}>
                {"+ (of 10%)"}
              </Stack>
            </Grid>
            <Grid md={4}>
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
          <Button autoFocus onClick={handleTopup} variant="contained">
            Topup<i>{` ( ${calculateTotal(formData.amount.value)}  ${data?.entityIcon} )`}</i>
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TopupModal;
