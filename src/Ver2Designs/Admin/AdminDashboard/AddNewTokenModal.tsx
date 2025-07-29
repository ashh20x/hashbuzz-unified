import SaveIcon from "@mui/icons-material/Save";
import { Avatar, Card, Divider, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useApiInstance } from "../../../APIConfig/api";
import { TokenDataObj, TokenInfo } from "../../../types";
interface AddNewTokenModalProps {
  open: boolean;
  onClose: (data?: TokenDataObj) => void;
}

export default function AddNewTokenModal({ open, onClose }: AddNewTokenModalProps) {
  // const [open, setOpen] = React.useState(false);
  const [tokenId, setTokenId] = React.useState("");
  const [tokenInfo, setTokenInfo] = React.useState<TokenInfo | null>(null);
  const { MirrorNodeRestAPI } = useApiInstance();
  const [loading, setLoading] = React.useState(false);

  const getTokenInfo = async () => {
    setLoading(true);
    try {
      if (tokenId.length > 6) {
        // const tokenInfo =  await Admin.getTokenInfo(tokenId);
        const tokenInfoReq = await MirrorNodeRestAPI.getTokenInfo(tokenId);
        const tokenInfo = tokenInfoReq.data;
        setTokenInfo(tokenInfo);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (data?: TokenDataObj) => {
    unstable_batchedUpdates(() => {
      setTokenId("");
      setTokenInfo(null);
    });
    if (onClose) onClose(data);
  };

  const handleAddNew = async () => {
    // setLoading(true);
    // try {
    //   if (tokenId && tokenId.length > 6 && tokenInfo) {
    //     // const tokenInfo =  await Admin.getTokenInfo(tokenId);
    //     const tokenInfoReq = await Admin.addNewToken({ tokenId, tokenData: tokenInfo, token_type: tokenInfo.type });
    //     toast.success(tokenInfoReq.message);
    //     handleClose(tokenInfoReq.data)
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>Add New Token</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the token Id which you wanted to whitelist</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="tokenId"
          label="Token Address"
          type="text"
          fullWidth
          variant="standard"
          placeholder="0.0.123456"
          onBlur={getTokenInfo}
          onChange={(event) => setTokenId(event.target.value)}
          value={tokenId}
          disabled={Boolean(tokenInfo)}
        // sx={{marginBottom:2}}
        />

        {tokenInfo ? (
          <Stack spacing={0.35} sx={{ p: 1, marginTop: 3 }} component={Card}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar variant="rounded">{tokenInfo.symbol}</Avatar>
              <Stack spacing={0.5} sx={{ marginLeft: 2 }}>
                <Typography fontWeight={700}>{tokenInfo.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Id:{tokenInfo.token_id} | Treasury Id: {tokenInfo.treasury_account_id}
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Typography variant="body2">Total supply: {tokenInfo.total_supply}</Typography>
            <Typography variant="body2">Token type: {tokenInfo.type}</Typography>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Close</Button>
        <Button
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={handleAddNew}
          disabled={!Boolean(tokenInfo)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
