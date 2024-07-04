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
import SpeedDialActions from "../../Components/SpeedDialActions";
import * as SC from "./styled";


const Dashboard = () => {
  const store = useStore();
  // console.log(store, "store");

  const { Integrations } = useApiInstance();
  const currentUser = store?.currentUser;

  const personalHandleIntegration = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await Integrations.twitterPersonalHandle();
      console.log({ url });
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
    const toastsMessage = store?.toasts;
    toastsMessage?.map((t) => toast(t.message, { type: t.type }));
    store?.updateState((_d) => ({ ..._d, toasts: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {/* <Grid container spacing={3}> */}
      {/* Card for wallet info */}
      <SC.StyledCardGenUtility>
        <CardGenUtility startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />} title={"Hedera Account ID"} content={<Typography variant="h5">{currentUser?.hedera_wallet_id}</Typography>} />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<TwitterIcon color="inherit" fontSize={"inherit"} />}
          title={"Personal X Account"}
          content={
            currentUser?.personal_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.personal_twitter_handle}</Typography>
            ) : (
              <Button type="button" variant="contained" disableElevation startIcon={<TwitterIcon />} onClick={personalHandleIntegration}>
                Connect
              </Button>
            )
          }
        />

        {/* card for Brand twitter handle */}
        <CardGenUtility
          startIcon={<BusinessIcon color="inherit" fontSize={"inherit"} />}
          title={"Brand X Account"}
          content={
            currentUser?.business_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.business_twitter_handle}</Typography>
            ) : (
              <Button type="button"  disabled={!isAllowedToCmapigner(currentUser?.role)} variant="contained" disableElevation startIcon={<TwitterIcon />} onClick={bizHandleIntegration}>
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
      <CampaignList user={currentUser} />

      {/* speed dial  action button */}
      <SpeedDialActions />
    </React.Fragment>
  );
};

export default Dashboard;
