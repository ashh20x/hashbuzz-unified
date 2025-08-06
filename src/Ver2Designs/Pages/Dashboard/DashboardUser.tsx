import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Button, Typography } from "@mui/material";
import React from "react";
import { useStore } from "../../../Store/StoreProvider";
import Balances from "./Balances";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../APIConfig/api";
import { getErrorMessage, isAllowedToCmapigner } from "../../../Utilities/helpers";
import * as SC from "./styled";
import XAccountConnectionWarning from "./XAccountConnectionWarning";
import XPlatformIcon from "../../../SVGR/XPlatformIcon";

const Dashboard = () => {
  const store = useStore();
  const { Integrations } = useApiInstance();
  const { currentUser, dispatch } = store;
  const [openXAlert, setOpenXAlert] = React.useState(false);

  const personalHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterPersonalHandle();
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.");
    }
  };
  const bizHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterBizHandle();
      window.location.href = url;
    } catch (err) {
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.");
    }
  };

  React.useEffect(() => {
    const toastsMessage = store.toasts;
    toastsMessage.map((t) => toast(t.message, { type: t.type }));
    dispatch({ type: "RESET_TOAST" });
  }, [dispatch]);

  return (
    <React.Fragment>
      <SC.StyledCardGenUtility>
        <CardGenUtility startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />} title={"Hedera Account ID"} content={<Typography variant="h5">{currentUser?.hedera_wallet_id}</Typography>} />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<XPlatformIcon color="inherit" size={40} />}
          title={"Personal 𝕏 Account"}
          content={
            currentUser?.personal_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.personal_twitter_handle}</Typography>
            ) : (
              <Button type="button" variant="contained" disableElevation startIcon={<XPlatformIcon size={18} />} onClick={() => setOpenXAlert(true)}>
                Connect
              </Button>
            )
          }
        />

        {/* card for Brand twitter handle */}
        <CardGenUtility
          startIcon={<BusinessIcon color="inherit" fontSize={"inherit"} />}
          title={"Brand 𝕏 Account"}
          content={
            currentUser?.business_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.business_twitter_handle}</Typography>
            ) : (
              <Button type="button" disabled={!isAllowedToCmapigner(currentUser?.role)} variant="contained" disableElevation startIcon={<XPlatformIcon size={18} />} onClick={bizHandleIntegration}>
                Connect
              </Button>
            )
          }
        />

        {/* Card for account balance */}
        <Balances />
        {/* </Grid> */}
      </SC.StyledCardGenUtility>

      {/* Campaign List section */}
      <CampaignList />

      {/* speed dial  action button */}
      {/* <SpeedDialActions /> */}
      <XAccountConnectionWarning open={openXAlert} handleClose={() => setOpenXAlert(false)} handleAgree={personalHandleIntegration} />
    </React.Fragment>
  );
};

export default Dashboard;
