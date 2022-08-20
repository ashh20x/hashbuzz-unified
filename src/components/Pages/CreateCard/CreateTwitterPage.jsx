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

export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [cardDataArr, setCardData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [openConsent, setConsentOpen] = useState(false);
  const [openConfirmModel, setConfirmModel] = useState(false);
  const [twitterLoginURL, setTwitterLoginURL] = useState("");

  const { dAppAPICall } = useDappAPICall();

  //check is device is small
  const theme = useTheme();
  const isDeviceIsSm = useMediaQuery(theme.breakpoints.down("sm"));

  //Hashpack hook init
  const { connectToExtension, disconnect, availableExtension, state, pairingData } = useHashconnectService();
  //Hashpack Effects
  useEffect(() => {
    if (pairingData && state === HashConnectConnectionState.Connected) toast.success("Wallet connected successfully");
  }, [state, pairingData]);

  useEffect(() => {
    if (pairingData?.accountIds) {
      (async () => {
        try {
          await dAppAPICall({
            method: "PUT",
            url: "users/update/wallet",
            data: {
              walletId: pairingData?.accountIds[0],
            },
          });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [pairingData]);

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

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setShowLoading(true);
      getUserInfo();
    }
    return () => (mounted = false);
  }, []);
  let navigate = useNavigate();
  const handleTemplate = () => {
    navigate("/campaign");
  };
  const getUserInfo = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      // const user_id =user.id
      setShowLoading(true);
      const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, null, false, cookies.token);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        getCampaignList();
        setUserData(response.data);
        const { consent } = response.data;
        if (consent === true) {
          // setShowLoading(false)
        } else {
          setShowLoading(false);
          setConsentOpen(true);
        }
      }
    } catch (err) {
      console.error("/user/profile/", err);
      setShowLoading(false);
    }
  };
  const getCampaignList = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    if (user && user.business_twitter_handle) {
      cardData[0].buttonTag = ["Reconnect"];
    }
    // cardData[0].content = user?.hedera_wallet_id;
    cardData[0].content = user?.business_twitter_handle;
    cardData[1].content = user?.personal_twitter_handle ? "@" + user?.personal_twitter_handle : "";
    cardData[1].text = 0 + " ℏ bars rewarded";
    cardData[2].content = user?.available_budget ? user?.available_budget + " ℏ" : 0 + " ℏ";
    cardData[3].content = "";

    try {
      const response = await APICall("/campaign/twitter-card/", "GET", null, null, false, cookies.token);
      if (response.data) {
        setTableData(response.data.results);
        if (response.data.results.length > 0) {
          let results = response.data.results.filter((data) => data.card_status === "Pending");
          let resultsRunning = response.data.results.filter((data) => data.card_status === "Running");
          if (results.length > 0) {
            cardData[3].content = results[0].card_status === "Pending" ? "Pending Approval" : results[0].card_status;
            results[0].card_status === "Pending" ? setButtonDisabled(true) : setButtonDisabled(false);
            setButtonDisabled(true);
          } else if (resultsRunning.length > 0) {
            cardData[3].content = resultsRunning[0].card_status === "Pending" ? "Pending Approval" : resultsRunning[0].card_status;
            resultsRunning[0].card_status === "Running" ? setButtonDisabled(true) : setButtonDisabled(false);
            setButtonDisabled(true);
          } else {
            cardData[3].content = "Completed";
            setButtonDisabled(false);
          }
          setCardData(cardData);
        } else {
          setCardData(cardData);
          setButtonDisabled(false);
        }
        setShowLoading(false);
      } else {
        setButtonDisabled(false);
        setShowLoading(false);
      }
    } catch (err) {
      console.log("/campaign/twitter-card/", err);
      setShowLoading(false);
    }
  };

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
    setShowLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const user_data = {
      ...userInfo,
      consent: true,
    };
    try {
      const response = await APICall("/user/profile/" + userInfo.id + "/", "PATCH", {}, user_data, false, cookies.token);
      if (response.data) {
        setShowLoading(false);
        setConsentOpen(false);

        // navigate("/dashboard");
      }
    } catch (err) {
      console.error("/user/profile/:", err);
      setShowLoading(false);
    }
  };

  const updateCampaignItem = async (data) => {
    try {
      setShowLoading(true);
      await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      getCampaignList();
      notify("Status updated!");
    } catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err);
      setShowLoading(false);
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

  const handleButtonClick = (e, i) => {
    if (e === "Top-Up") {
      setTopUpOpen(true);
    } else if (i === 0) {
      (async () => {
        try {
          const response = await APIAuthCall("/user/profile/request-brand-twitter-connect", "GET", {}, {}, cookies.token);
          if (response.data) {
            const { url } = response.data;
            setTwitterLoginURL(url);
            if (e === "Connect") {
              setConfirmModel(true);
            } else {
              window.location.href = url + "&force_login=true";
            }
          }
        } catch (error) {
          console.error("error===", error);
        }
      })();
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
          content={pairingData?.accountIds[0].toString()}
          buttonTag={[`${pairingData ? "Disconnect" : "Connect"}`]}
          isButton={true}
          text={""}
          buttonClick={(e) => {
            if (pairingData) disconnect();
            else connectHashpack();
          }}
        />
        {cardDataArr.map((item, i) => (
          <StatusCard
            key={item.title}
            title={item.title}
            content={item.content}
            buttonTag={item.buttonTag}
            isButton={item.isButton}
            isDisable={i === 1 ? buttonDisabled : false}
            text={item.text}
            buttonClick={(e) => handleButtonClick(e, i)}
          />
        ))}
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
      <StatusSection>A 10% charge is applied for every top up (you can run unlimited number of campaigns for the escrowed budget).</StatusSection>
      <PrimaryButton
        text="CREATE CAMPAIGN"
        variant="contained"
        onclick={handleTemplate}
        disabled={buttonDisabled || userData?.available_budget === 0 || userData?.available_budget === null}
      />
      {/* (userData?.available_budget === 0 || userData?.available_budget === null) */}
      <TopUpModal open={openTopup} setOpen={setTopUpOpen} />
      {open ? <DisplayTableModal open={open} setOpen={setOpen} item={selectedCampaign}></DisplayTableModal> : null}
      <ConsentModal open={openConsent} setOpen={setConsentOpen} submit={() => submitClick()} noClick={() => clickNo()} />
      <ConfirmModal open={openConfirmModel} setOpen={setConfirmModel} confirmClick={() => confirmClick()} cancelClick={() => cancelClick()} />
      <Loader open={showLoading} />
    </ContainerStyled>
  );
};
