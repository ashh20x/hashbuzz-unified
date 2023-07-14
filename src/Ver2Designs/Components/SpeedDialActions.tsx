import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useHashconnectService } from "../../HashConnect";
import ℏicon from "../../IconsPng/ℏicon.png";
import { useStore } from "../../Providers/StoreProvider";
import HashbuzzIcon from "../../SVGR/HashbuzzIcon";
import HashpackIcon from "../../SVGR/HashpackIcon";
import { forceLogout } from "../../Utilities/Constant";

const postAuthActions = [
  {
    icon: <img src={ℏicon} alt={"ℏ"} style={{ height: "24px", width: "auto", marginRight: 10, display: "inline-block" }} />,
    name: "Topup",
    id: "top-up",
  },

  { icon: <LogoutIcon />, name: "Logout", id: "logout" },
];
const beforeAuthActions = [
  { icon: <HashpackIcon height={24}/>, name: "Hashpack", id: "hashpack-connect" },
  { icon: <QrCodeIcon />, name: "QR", id: "qr-connect" },
];
// interface SpeedDialTooltipOpenProps {
//   user?: CurrentUser;
// }

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SpeedDialActions = () => {
  const [open, setOpen] = React.useState(false);
  const [qrCodeOpen, setQrCodeOpen] = React.useState(false);
  const { pairingString, pairingData } = useHashconnectService();
  const store = useStore();


  const navigate = useNavigate();

  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  const connectWalletProcess = () => {
    console.log("Connect logo");
  };
  const showSnackBar = () => {};

  const handleQrCodeGen = () => {
    if (pairingString) {
      handleClose();
      setQrCodeOpen(true);
    }
  };

  const handleClick = (name: string) => {
    switch (name) {
      case "top-up":
        if (store?.currentUser?.hedera_wallet_id) connectWalletProcess();
        else showSnackBar();
        break;
      case "logout":
        forceLogout();
        navigate("/");
        break;
      case "qr-connect":
        handleQrCodeGen();
        break;
      case "hashpack-connect":
        alert("hashpackconnect");
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      {/* <Backdrop open={open} /> */}
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 40, right: 40 }}
        icon={<HashbuzzIcon size={60} color="#fff"/>}
        openIcon={<CloseIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        FabProps={{
          sx:{
            colorScheme:"light"
          }
        }}
      
      >
        {(pairingData?.topic ? postAuthActions : beforeAuthActions).map((action) => {
          // if(action.name === "Connect" && pairingData?.topic) return null;
          return (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={(event) => handleClick(action.id)}
            />
          );
        })}
      </SpeedDial>
      <QRCodeDialog
        open={qrCodeOpen}
        onclose={() => {
          setQrCodeOpen(false);
          // handleClose()
        }}
      />
    </React.Fragment>
  );
};

interface QRCodeDialogProps {
  open: boolean;
  onclose: () => void;
}

const QRCodeDialog = ({ open, onclose }: QRCodeDialogProps) => {
  const [qrCodeOpen, setQrCodeOpen] = React.useState(false);
  const { pairingString, pairingData } = useHashconnectService();

  const handleQRCodeDialogClose = React.useCallback(() => {
    setQrCodeOpen(false);
    if (onclose) onclose();
  }, [onclose]);

  React.useEffect(() => {
    setQrCodeOpen(open);
  }, [open]);

  React.useEffect(() => {
    if (pairingData?.topic) handleQRCodeDialogClose();
  }, [handleQRCodeDialogClose, pairingData]);

  return (
    <Dialog
      open={qrCodeOpen}
      aria-labelledby="QRcode-dialog-title"
      onClose={handleQRCodeDialogClose}
      TransitionComponent={Transition}
      aria-describedby="qr-code-dialog-having-paring-string"
    >
      <DialogTitle id="QRcode-dialog-title">{"Hashpack pairing string"}</DialogTitle>
      <DialogContent>
        <DialogContent id="qr-code-dialog-having-paring-string">
          Copy paring string and paste it in your wallet extension or scan QR code with your mobile wallet.
        </DialogContent>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <Typography noWrap sx={{ width: 150 }}>
            {pairingString}
          </Typography>
          <Button size="small" endIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(pairingString ?? "")}>
            Copy
          </Button>
        </Stack>
        <Stack alignItems={"center"} justifyContent={"center"} sx={{ marginTop: 3 }}>
          {pairingString ? <QRCode value={pairingString} size={256} bgColor="#ffffff" viewBox={`0 0 256 256`} /> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleQRCodeDialogClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpeedDialActions;
