import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import * as React from "react";
import ℏicon from "../../../IconsPng/ℏicon.png";

const actions = [
  { icon: <img src={ℏicon} alt={"ℏ"} style={{ height: "24px", width: "auto", marginRight: 10, display: "inline-block" }} />, name: "Topup" },
  { icon: <QrCodeIcon />, name: "Connect" },
  { icon: <LogoutIcon />, name: "Logout" },
];

const SpeedDialTooltipOpen = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    </React.Fragment>
  );
};
export default SpeedDialTooltipOpen;


