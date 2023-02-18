import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import * as React from "react";
import ℏicon from "../../../IconsPng/ℏicon.png";
import { CurrentUser } from "../../../types";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const actions = [
  { icon: <img src={ℏicon} alt={"ℏ"} style={{ height: "24px", width: "auto", marginRight: 10, display: "inline-block" }} />, name: "Topup" },
  { icon: <QrCodeIcon />, name: "Connect" },
  { icon: <LogoutIcon />, name: "Logout" },
];


interface SpeedDialTooltipOpenProps {
  user?:CurrentUser
}

const SpeedDialTooltipOpen = ({user}:SpeedDialTooltipOpenProps) => {
  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setShowSnackBar] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const connectWalletProcess = () => {
    console.log("Connect logo")
  }
  const showSnackBar = () => {

  }

  const handleClick = (name:"Topup"|"connect"|"Logout") => {
    switch (name) {
      case "Topup":
          if(user?.hedera_wallet_id) connectWalletProcess();
          else showSnackBar()
        break;
    
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} tooltipOpen onClick={handleClose} />
        ))}
      </SpeedDial>
      {/* <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      /> */}
    </React.Fragment>
  );
};
export default SpeedDialTooltipOpen;


