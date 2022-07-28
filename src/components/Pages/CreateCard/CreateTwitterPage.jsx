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
export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState({});
  const [cardDataArr, setCardData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCampaignList();
    }
    return () => mounted = false;
  }, [])
  let navigate = useNavigate();
  const handleTemplate = () => {
    navigate("/campaign");
  };
  const getCampaignList = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
    if (user.business_twitter_handle) {
      cardData[1].buttonTag = ["Reconnect"]
    }
    cardData[0].content = user.hedera_wallet_id;
    cardData[1].content = user.business_twitter_handle;
    cardData[2].content = '@' + user.personal_twitter_handle;
    cardData[2].text = 0 + ' ℏ bars rewarded';
    cardData[3].content = user.available_budget ? user.available_budget + ' ℏ' : 0 + ' ℏ';
    // cardData[4].content = user.campaign_status;
    try {
      const response = await APICall("/campaign/twitter-card/", "GET", null, null, false, cookies.token);
      if (response.data) {
        setTableData(response.data.results);
        if (response.data.results.length > 0) {
          cardData[4].content = response.data.results[0].card_status;
          if (response.data.results[0].card_status !== "Running") {
            setButtonDisabled(false)
          }
          setCardData(cardData);
        }
        else {
          setCardData(cardData);
        }

      }
    }
    catch (err) {
      console.log("/campaign/twitter-card/", err)
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
  const updateCampaignItem = async (data) => {
    try {
      await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      getCampaignList();
    }
    catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err)
    }
  };

  const handleAction = (element, item) => {
    const updateData = {
      "card_id": item.id,
      "card_status": element === "Stop" ? "Completed" : "Running"
    }
    updateCampaignItem(updateData);
  };
  const handleTran = () => {
    navigate("/invoice");
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
            window.location.href = url

          }
        } catch (error) {
          console.error("error===", error);
        }

      })();
    }
  };

  return (
    <ContainerStyled align="center" justify="space-between">
      {userData?.username === "ashh20x" ? <LinkContainer><Link to="/admin"><p>Admin Panel</p></Link></LinkContainer> : null}
      <CardSection>
        {cardData.map((item, i) => (
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
                  {index + 1}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                <CustomTableBodyCell><a href='#' onClick={() => linkClick(item)}>Link</a></CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_claimed}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {!item.isbutton && item.card_status !== "Completed" ? (
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
        disabled={!buttonDisabled}
      />
      <TopUpModal
        open={openTopup}
        setOpen={setTopUpOpen}
      />
      {open ? <DisplayTableModal
        open={open}
        setOpen={setOpen}
        item={selectedCampaign}
      ></DisplayTableModal> : null}
    </ContainerStyled>
  );
};
