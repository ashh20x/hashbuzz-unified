import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { cardData } from "../../../Data/Cards";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import StatusCard from "../../StatusCard/StatusCard";
import {
  CardSection,
  TableSection,
  StatusSection,
  LinkContainer
} from "./CreateTwitterPage.styles";
import { TableRow, TableBody } from "@mui/material";
import { tableHeadRow } from "../../../Data/TwitterTable";
import {
  CustomRowHead,
  CustomTable2,
  CustomTableBodyCell,
  CustomTableHeadCell,
} from "../../Tables/CreateTable.styles";
import { APICall, APIAuthCall } from "../../../APIConfig/APIServices";
import TopUpModal from "../../PreviewModal/TopUpModal";
// import {useHashConnect } from "./HashConnectAPIProvider";
import { useCookies } from 'react-cookie';
import DisplayTableModal from '../../PreviewModal/DisplayTableModal';
import { Loader } from "../../Loader/Loader"
import notify from '../../Toaster/toaster';
import ConsentModal from "../../PreviewModal/ConsentPreviewModal";
import ConfirmModal from "../../PreviewModal/ConfirmModal";


export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [cardDataArr, setCardData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [openConsent, setConsentOpen] = useState(false);
  const [openConfirmModel, setConfirmModel] = useState(false);
  const [twitterLoginURL, setTwitterLoginURL] = useState("");



  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setShowLoading(true);
      getUserInfo();
    }
    return () => mounted = false;
  }, [])
  let navigate = useNavigate();
  const handleTemplate = () => {
    navigate("/campaign");
  };
  const getUserInfo = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      // const user_id =user.id
      setShowLoading(true)
      const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, null, false, cookies.token);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        getCampaignList();
        setUserData(response.data)
        const { consent } = response.data;
        if (consent === true) {
          // setShowLoading(false)

        }
        else {
          setShowLoading(false)
          setConsentOpen(true);
        }
      }
    }
    catch (err) {
      console.error("/user/profile/", err)
      setShowLoading(false)

    }
  }
  const getCampaignList = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
    if (user && user.business_twitter_handle) {
      cardData[1].buttonTag = ["Reconnect"]
    }
    cardData[0].content = user?.hedera_wallet_id;
    cardData[1].content = user?.business_twitter_handle;
    cardData[2].content = user?.personal_twitter_handle ? '@' + user?.personal_twitter_handle : '';
    cardData[2].text = 0 + ' ℏ bars rewarded';
    cardData[3].content = user?.available_budget ? user?.available_budget + ' ℏ' : 0 + ' ℏ';
    cardData[4].content = "";

    try {
      const response = await APICall("/campaign/twitter-card/", "GET", null, null, false, cookies.token);
      if (response.data) {
        setTableData(response.data.results);
        if (response.data.results.length > 0) {
          let results = response.data.results.filter(data => data.card_status === 'Pending')
          let resultsRunning = response.data.results.filter(data => data.card_status === 'Running')
          if (results.length > 0) {
            cardData[4].content = results[0].card_status === "Pending" ? "Pending Approval" : results[0].card_status
            results[0].card_status === "Pending" ? setButtonDisabled(true) : setButtonDisabled(false)
            setButtonDisabled(true)
          }
          else if (resultsRunning.length > 0) {
            cardData[4].content = resultsRunning[0].card_status === "Pending" ? "Pending Approval" : resultsRunning[0].card_status
            resultsRunning[0].card_status === "Running" ? setButtonDisabled(true) : setButtonDisabled(false)
            setButtonDisabled(true)
          }
          else {
            cardData[4].content = "Completed"
            setButtonDisabled(false)
          }
          setCardData(cardData);
        }
        else {
          setCardData(cardData);
          setButtonDisabled(false)
        }
        setShowLoading(false);

      }
      else {
        setButtonDisabled(false)
        setShowLoading(false);
      }
    }
    catch (err) {
      console.log("/campaign/twitter-card/", err)
      setShowLoading(false);
    }
  };

  const handleActionButon = (key) => {
    switch (key) {
      case "Running":
        return ["Stop"]
      case "Pending":
        return []
      case "Pause":
        return ['Run', "Stop"]
      case "Completed":
        return ["Promotion ended"]
      case "Rejected":
        return []
      default:
        return []
    }
  }

  const submitClick = async () => {
    setShowLoading(true)
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const user_data = {
      ...userInfo,
      "consent": true
    }
    try {
      const response = await APICall("/user/profile/" + userInfo.id + "/", "PATCH", {}, user_data, false, cookies.token);
      if (response.data) {
        setShowLoading(false)
        setConsentOpen(false);

        // navigate("/dashboard");
      }
    }
    catch (err) {
      console.error("/user/profile/:", err)
      setShowLoading(false)

    }
  }

  const updateCampaignItem = async (data) => {
    try {
      setShowLoading(true);
      await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      getCampaignList();
      notify("Status updated!")
    }
    catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err)
      setShowLoading(false);
      notify("Something went wrong! Please try again later")
    }
  };

  const clickNo = () => {
    // Alert('You need to Accept consent!');
  }

  const handleAction = (element, item) => {
    const updateData = {
      "card_id": item.id,
      "card_status": element === "Stop" ? "Completed" : "Running"
    }
    updateCampaignItem(updateData);
  };

  const linkClick = (item) => {
    setSelectedCampaign(item)
    setOpen(true);
    // navigate("/invoice");
  };




  const handleButtonClick = (e, i) => {
    if (e === 'Top-Up') {
      setTopUpOpen(true)
    }
    else if (i === 0) {
      alert(
        "Please install hashconnect wallet extension first. from chrome web store."
      );
    }
    else if (i === 1) {
      (async () => {

        try {
          const response = await APIAuthCall("/user/profile/request-brand-twitter-connect", "GET", {}, {}, cookies.token);
          if (response.data) {
            const { url } = response.data;
            setTwitterLoginURL(url)
            if (e !== "Connect") {
              setConfirmModel(true)
            }
            else {
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
  }

  const cancelClick = () => {
    window.location.href = twitterLoginURL+ "&force_login=true";
  }
  

  return (
    <ContainerStyled align="center" justify="space-between">
      {userData && userData?.username?.toLowerCase() === "ashh20x" ? <LinkContainer><Link to="/admin"><p>Admin Panel</p></Link></LinkContainer> : null}
      <CardSection>
        {cardDataArr.map((item, i) => (
          <StatusCard
            title={item.title}
            content={item.content}
            buttonTag={item.buttonTag}
            isButton={item.isButton}
            text={item.text}
            buttonClick={(e) => handleButtonClick(e, i)}
          />
        ))}
      </CardSection>

      <TableSection>
        <CustomTable2 stickyHeader aria-label="simple table">
          <CustomRowHead>
            <TableRow>
              {tableHeadRow.map((item) => (
                <CustomTableHeadCell
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {item.label}
                </CustomTableHeadCell>
              ))}
            </TableRow>
          </CustomRowHead>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow>
                <CustomTableBodyCell
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {tableData.length - index}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                <CustomTableBodyCell><a href='#' onClick={() => linkClick(item)}>Link</a></CustomTableBodyCell>
                <CustomTableBodyCell>{item.campaign_budget}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_claimed}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {!item.isbutton && item.card_status !== "Completed" ? (
                    item.card_status == "Rejected" ? "Rejected" :
                      handleActionButon(item.card_status).map((element) => (
                        <SecondaryButton text={element} margin="5%" onclick={() => handleAction(element, item)} />
                      ))
                  ) : (
                    "Promotion ended"
                  )}
                </CustomTableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable2>
      </TableSection>
      <StatusSection>
        A 10% charge is applied for every top up (you can run unlimited number of campaigns for the escrowed budget).
      </StatusSection>
      <PrimaryButton
        text="CREATE CAMPAIGN"
        variant="contained"
        onclick={handleTemplate}
        disabled={buttonDisabled || (userData?.available_budget === 0 || userData?.available_budget === null)}
      />
      {/* (userData?.available_budget === 0 || userData?.available_budget === null) */}
      <TopUpModal
        open={openTopup}
        setOpen={setTopUpOpen}
      />
      {open ? <DisplayTableModal
        open={open}
        setOpen={setOpen}
        item={selectedCampaign}
      ></DisplayTableModal> : null}
      <ConsentModal
        open={openConsent}
        setOpen={setConsentOpen}
        submit={() => submitClick()}
        noClick={() => clickNo()}
      />
      <ConfirmModal
        open={openConfirmModel}
        setOpen={setConfirmModel}
        confirmClick={() => confirmClick()}
        cancelClick={() => cancelClick()}
      />
      <Loader open={showLoading} />
    </ContainerStyled>
  );
};
