import { TableBody, TableRow, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APIAuthCall, APICall } from "../../../APIConfig/APIServices";
import { cardData } from "../../../Data/Cards";
import { tableHeadRow } from "../../../Data/TwitterTable";
import { useHashconnectService } from "../../../HashConnect";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import { Loader } from "../../Loader/Loader";
import ConfirmModal from "../../PreviewModal/ConfirmModal";
import ConsentModal from "../../PreviewModal/ConsentPreviewModal";
import DisplayTableModal from "../../PreviewModal/DisplayTableModal";
import TopUpModal from "../../PreviewModal/TopUpModal";
import StatusCard from "../../StatusCard/StatusCard";
import { CustomRowHead, CustomTable2, CustomTableBodyCell, CustomTableHeadCell } from "../../Tables/CreateTable.styles";
import notify from "../../Toaster/toaster";
import { CardSection, LinkContainer, StatusSection, TableSection } from "./CreateTwitterPage.styles";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import { useDappAPICall } from "../../../APIConfig/dAppApiServices";
import { useStore } from "../../../Providers/StoreProvider";

export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [cardDataArr, setCardData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [openConsent, setConsentOpen] = useState(false);
  const [openConfirmModel, setConfirmModel] = useState(false);
  const [twitterLoginURL, setTwitterLoginURL] = useState("");
  const [isTopUp, setisTopUp] = useState(false);

  const { dAppAPICall } = useDappAPICall();
  const { state: store, setStore } = useStore();
  const navigate = useNavigate();

  //check is device is small
  const theme = useTheme();
  const isDeviceIsSm = useMediaQuery(theme.breakpoints.down("sm"));

  //Hashpack hook init
  const { connectToExtension, disconnect, availableExtension, state, pairingData } = useHashconnectService();
  //Hashpack Effects
  useEffect(() => {
    if (pairingData && pairingData.accountIds.length > 0) {
      toast.success("Wallet connected successfully !!");
      (async () => {
        try {
          await dAppAPICall({
            method: "PUT",
            url: "users/update/wallet",
            data: {
              walletId: pairingData?.accountIds[0],
            },
          });
          setStore((p) => ({ ...p, user: { ...p.user, hedera_wallet_id: pairingData?.accountIds[0] } }));
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [state, pairingData]);

  //useEffectForUpdateStoreWithWalletId

  //Hashpack functions
  const connectHashpack = async () => {
    try {
      if (isDeviceIsSm) {
        toast.warning("Please connect with HashPack extension on your desktop to make a payment");
        return alert("Please connect with HashPack extension on your desktop to make a payment");
      }
      if (availableExtension) {
        connectToExtension();
      } else {
        // await sendMarkOFwalletInstall();
        // Taskbar Alert - Hashpack browser extension not installed, please click on <Go> to visit HashPack website and install their wallet on your browser
        alert(
          "Alert - HashPack browser extension not installed, please click on <<OK>> to visit HashPack website and install their wallet on your browser.  Once installed you might need to restart your browser for Taskbar to detect wallet extension first time."
        );
        window.open("https://www.hashpack.app");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCampaignList = async () => {
    try {
      const response = await APICall("/campaign/twitter-card/", "GET", null, null, false, cookies.token);
      if (response.data) {
        setTableData(response.data.results);
        let pendingResult = response.data.results.find((data) => data.card_status === "Pending");
        let runningResult = response.data.results.find((data) => data.card_status === "Running");
        if(pendingResult || runningResult || !store.user.hedera_wallet_id || !store.available_budget) setButtonDisabled(true)
        else setButtonDisabled(false);

        if(pendingResult) setStore(d => ({...d , currentStatus:"Pending Approval"}));
        if(runningResult) setStore(d => ({...d , currentStatus:"Running"}));
      }
    } catch (err) {
      console.log("/campaign/twitter-card/", err);
    }
  };

  // Get users details functions;
  const getUserInfo = async () => {
    const user_id = localStorage.getItem("user_id");
    setShowLoading(true);
    try {
      // const user_id =user.id
      const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, null, false, cookies.token);
      if (response.data) {
        const { consent } = response.data;
        if (!consent) setConsentOpen(true);

        //! save data to local storage for further user.
        localStorage.setItem("user", JSON.stringify(response.data));

        //? Update user object to the context store for.
        setStore((ps) => ({ ...ps, available_budget: response.data.available_budget, user: response.data }));

        //!! get all the active campaign details...
        console.log("passed from hre");
        await getCampaignList();
      }
    } catch (err) {
      console.error("/user/profile/", err);
    } finally {
      setShowLoading(false);
    }
  };

  // get all the users details on mounting
  useEffect(() => {
    (async () => {
      await getUserInfo();
    })();
  }, []);

  const handleTemplate = () => {
    navigate("/campaign");
  };

  //Provide status of the account

  const handleActionButon = (key) => {
    switch (key) {
      case "Running":
        return ["Stop"];
      case "Pending":
        return [];
      case "Pause":
        return ["Run", "Stop"];
      case "Completed":
        return ["Promotion ended"];
      case "Rejected":
        return [];
      default:
        return [];
    }
  };

  const submitClick = async () => {
    // setShowLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const user_data = {
      ...userInfo,
      consent: true,
    };
    try {
      const response = await APICall("/user/profile/" + userInfo.id + "/", "PATCH", {}, user_data, false, cookies.token);
      if (response.data) {
        // setShowLoading(false);
        setConsentOpen(false);

        // navigate("/dashboard");
      }
    } catch (err) {
      console.error("/user/profile/:", err);
      // setShowLoading(false);
    }
  };

  const updateCampaignItem = async (data) => {
    try {
      // setShowLoading(true);
      await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      getCampaignList();
      notify("Status updated!");
    } catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err);
      // setShowLoading(false);
      notify("Something went wrong! Please try again later");
    }
  };

  const clickNo = () => {
    // Alert('You need to Accept consent!');
  };

  const handleAction = (element, item) => {
    const updateData = {
      card_id: item.id,
      card_status: element === "Stop" ? "Completed" : "Running",
    };
    updateCampaignItem(updateData);
  };

  const linkClick = (item) => {
    setSelectedCampaign(item);
    setOpen(true);
    // navigate("/invoice");
  };

  const handleButtonClick = (e) => {
    switch (e) {
      case "Top-Up":
        setisTopUp(true);
        setTopUpOpen(true);
        break;
      case "Reimburse":
        setisTopUp(false);
        setTopUpOpen(true);
        break;
      case "Connect brand handle":
        (async () => {
          try {
            // setShowLoading(true);
            const response = await APIAuthCall("/user/profile/request-brand-twitter-connect", "GET", {}, {}, cookies.token);
            if (response.data) {
              // setShowLoading(false);
              const { url } = response.data;
              localStorage.setItem("firstTime", false);
              setTwitterLoginURL(url);
              window.location.href = url + "&force_login=true";
            }
          } catch (error) {
            console.error("error===", error);
            // setShowLoading(false);
          }
        })();
        break;
      default:
        break;
      }
  };

  const confirmClick = () => {
    window.location.href = twitterLoginURL;
  };

  const cancelClick = () => {
    window.location.href = twitterLoginURL + "&force_login=true";
  };

  return (
    <ContainerStyled align="center" justify="space-between">
      {userData && userData?.username?.toLowerCase() === "ashh20x" ? (
        <LinkContainer>
          <Link to="/admin">
            <p>Admin Panel</p>
          </Link>
        </LinkContainer>
      ) : null}
      <CardSection>
        <StatusCard
          title={"Hedera Account ID"}
          content={store.user.hedera_wallet_id ?? ""}
          buttonTag={[`${!store.user.hedera_wallet_id ? "Connect" : ""}`]}
          isButton={!store.user.hedera_wallet_id}
          text={""}
          buttonClick={(e) => {
            if (pairingData) disconnect();
            else connectHashpack();
          }}
        />
        <StatusCard
          title={"Available Budget"}
          content={(store?.available_budget / Math.pow(10, 8)).toFixed(3) + " ℏ"}
          buttonTag={["Top-Up", "Reimburse"]}
          isButton={true}
          text={""}
          isDisable={!store?.user?.hedera_wallet_id}
          buttonClick={(e) => handleButtonClick(e)}
        />
        <StatusCard
          title={"Brand Twitter Handle"}
          content={store?.user?.business_twitter_handle ? "@" + store?.user?.business_twitter_handle : ""}
          buttonTag={[!store?.user?.business_twitter_handle ? "Connect brand handle" : "Reconnect"]}
          isButton={!store?.user?.business_twitter_handle}
          text={""}
          buttonClick={(e) => handleButtonClick(e)}
          isDisable={store?.currentStatus}
        />
        <StatusCard
          title={"Personal Twitter Handle"}
          content={store?.user?.personal_twitter_handle ? "@" + store?.user?.personal_twitter_handle : ""}
          buttonTag={["ReConnect"]}
          isButton={false}
          text={"Total 0 ℏ rewarded"}
        />
        {tableData.length > 0 ? <StatusCard title={"Status"} content={store?.currentStatus} /> : null}
        {/* {cardDataArr.map((item, i) => (
          <StatusCard
            key={item.title}
            title={item.title}
            content={item.content}
            buttonTag={item.buttonTag}
            isButton={item.isButton}
            isDisable={i === 0 ? buttonDisabled : false}
            text={item.text}
            buttonClick={(e) => handleButtonClick(e, i)}
          />
        ))} */}
      </CardSection>

      <TableSection>
        <CustomTable2 stickyHeader>
          <CustomRowHead>
            <TableRow>
              {tableHeadRow.map((item) => (
                <CustomTableHeadCell key={item.id} align={item.align} style={{ minWidth: item.minWidth, width: item.width }}>
                  {item.label}
                </CustomTableHeadCell>
              ))}
            </TableRow>
          </CustomRowHead>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow>
                <CustomTableBodyCell key={item.id} align={item.align} style={{ minWidth: item.minWidth, width: item.width }}>
                  {tableData.length - index}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  <a href="#" onClick={() => linkClick(item)}>
                    Link
                  </a>
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.campaign_budget}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_claimed}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {!item.isbutton && item.card_status !== "Completed"
                    ? item.card_status == "Rejected"
                      ? "Rejected"
                      : handleActionButon(item.card_status).map((element) => (
                          <SecondaryButton text={element} margin="5%" onclick={() => handleAction(element, item)} />
                        ))
                    : "Promotion ended"}
                </CustomTableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable2>
      </TableSection>
      <StatusSection>
        At the moment you can only run one campaign at a time, and the topped up budget can be used across unlimited number of campaigns.
      </StatusSection>
      <PrimaryButton
        text="CREATE CAMPAIGN"
        variant="contained"
        onclick={handleTemplate}
        disabled={buttonDisabled || userData?.available_budget === 0 || userData?.available_budget === null}
      />
      {/* (userData?.available_budget === 0 || userData?.available_budget === null) */}
      <TopUpModal open={openTopup} setOpen={setTopUpOpen} isTopUp={isTopUp} />
      {open ? <DisplayTableModal open={open} setOpen={setOpen} item={selectedCampaign}></DisplayTableModal> : null}
      <ConsentModal open={openConsent} setOpen={setConsentOpen} submit={() => submitClick()} noClick={() => clickNo()} />
      <ConfirmModal open={openConfirmModel} setOpen={setConfirmModel} confirmClick={() => confirmClick()} cancelClick={() => cancelClick()} />
      <Loader open={showLoading} />
    </ContainerStyled>
  );
};
