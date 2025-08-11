import { useLazyGetTwitterBizHandleQuery } from "@/API/integration";
import { useAppSelector } from "@/Store/store";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import { Button, Typography } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import XPlatformIcon from "../../../SVGR/XPlatformIcon";
import { getErrorMessage } from "../../../Utilities/helpers";
import Balances from "./Balances";
import CampaignList from "./CampaignList";
import { CardGenUtility } from "./CardGenUtility";
import * as SC from "./styled";

const Dashboard = () => {
  const { currentUser } = useAppSelector(s => s.app)
  const [getTwitterBizHandle, { isLoading: isLoadingBizHandle }] = useLazyGetTwitterBizHandleQuery();

  const bizHandleIntegration = React.useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const { url } = await getTwitterBizHandle().unwrap();
      window.location.href = url;
    } catch (err) {
      console.error("Error during brand handle integration:", err);
      toast.error(getErrorMessage(err) ?? "Error while requesting personal handle integration.");
    }
  }, [getTwitterBizHandle]);

  return (
    <React.Fragment>
      <SC.StyledCardGenUtility>
        <CardGenUtility startIcon={<AccountBalanceWalletIcon color="inherit" fontSize={"inherit"} />} title={"Hedera Account ID"} content={<Typography variant="h5">{currentUser?.hedera_wallet_id}</Typography>} />

        {/* card for personal twitter handle */}
        <CardGenUtility
          startIcon={<XPlatformIcon color="inherit" size={40} />}
          title={"Personal 𝕏 Account"}
          content={(
            <Typography variant="h5">{"@" + currentUser?.personal_twitter_handle}</Typography>
          )} />

        {/* card for Brand twitter handle */}
        <CardGenUtility
          startIcon={<BusinessIcon color="inherit" fontSize={"inherit"} />}
          title={"Brand 𝕏 Account"}
          content={
            currentUser?.business_twitter_handle ? (
              <Typography variant="h5">{"@" + currentUser?.business_twitter_handle}</Typography>
            ) : (
              <Button variant="outlined" onClick={bizHandleIntegration} loading={isLoadingBizHandle}>
                Connect Brand 𝕏 Account
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
    </React.Fragment>
  );
};

export default Dashboard;
