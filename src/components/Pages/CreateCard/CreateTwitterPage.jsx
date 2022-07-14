import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { cardData } from "../../../Data/Cards";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import StatusCard from "../../StatusCard/StatusCard";
import {
  CardSection,
  TableSection,
  StatusSection,
} from "./CreateTwitterPage.styles";
import { TableRow, TableBody } from "@mui/material";
import { tableHeadRow } from "../../../Data/TwitterTable";
import {
  CustomRowHead,
  CustomTable2,
  CustomTableBodyCell,
  CustomTableHeadCell,
} from "../../Tables/CreateTable.styles";
import { APICall, APIAuthCall } from "../../../APIConfig/APIServices"
import TopUpModal from "../../PreviewModal/TopUpModal";
// import {useHashConnect } from "./HashConnectAPIProvider";
import { useCookies } from 'react-cookie';
export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);

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
    cardData[2].text = 0 + ' hbars rewarded';
    cardData[3].content = user.available_budget ? user.available_budget + ' h' : 0 + ' h';
    cardData[4].content = user.campaign_status;
    try {
      const response = await APICall("/campaign/twitter-card/", "GET", null, null, false, cookies.token);
      if (response.data) {
        setTableData(response.data.results);
      }
    }
    catch (err) {
      console.log("/campaign/twitter-card/", err)
    }
  };

  const handleTran = () => {
    navigate("/invoice");
  };


  const handleButtonClick = (e, i) => {
    if (e === 'Top-Up') {
      setTopUpOpen(true)
    }
    else if (i === 0) {
      // if (installedExtensions) connect();
      // else
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
            {tableData.map((item) => (
              <TableRow>
                <CustomTableBodyCell
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {item.id}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.tweet_stat}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_spent}</CustomTableBodyCell>
                <CustomTableBodyCell>{item.amount_claimed}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {!item.isbutton ? (
                    ["Run", "Stop"].map((element) => (
                      <SecondaryButton text={element} margin="5%" />
                    ))
                  ) : (
                    <a onClick={handleTran}>{item.actions}</a>
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
      />
      <TopUpModal
        open={openTopup}
        setOpen={setTopUpOpen}
      />
    </ContainerStyled>
  );
};
