import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useApiInstance } from "../../../APIConfig/api";

interface AddNewTokenModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddNewTokenModal({ open, onClose }: AddNewTokenModalProps) {
  // const [open, setOpen] = React.useState(false);
  const [tokenId, setTokenId] = React.useState("");
  const [isVerified , setIsVerified] = React.useState(false);
  const {MirrorNodeRestAPI} = useApiInstance()

  const getTokenInfo = async() => {
      try{
        // const tokenInfo =  await Admin.getTokenInfo(tokenId);
        const tokenInfo =  await MirrorNodeRestAPI.getTokenInfo(tokenId);
        console.log(tokenInfo);
      }
      catch(err){
        console.log(err)
      }
  };

  const handleClose = () => {
    setTokenId("")
    if(onClose) onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button disabled={!isVerified}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
