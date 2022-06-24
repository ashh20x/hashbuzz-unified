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
import { APICall } from "../../../APIConfig/APIServices"
import TopUpModal from "../../PreviewModal/TopUpModal";

export const CreateTwitterPage = () => {
  const [tableData, setTableData] = useState([]);
  const [userData, setUserData] = useState({});
  const [openTopup, setTopUpOpen] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCampaignList();
    }
    return () => mounted = false;
  }, [])
  let navigate = useNavigate();
  const handleTemplate = () => {
    navigate("/template");
  };
  const getCampaignList = async () => {
    const user = localStorage.getItem('user');
    setUserData(user);
    cardData[0].content = user.hedera_wallet_id;
    cardData[1].content = user.business_twitter_handle;
    cardData[2].content = user.personal_twitter_handle;
    cardData[3].content = user.available_budget;
    cardData[4].content = user.campaign_status;
    const response = await APICall("/campaign/campaign/", "GET", null, null);
    if (response.data) {
      setTableData(response.data.results);
    }
  };

  const handleTran = () => {
    navigate("/invoice");
  };

  const handleButtonClick = (e) => {
    console.log("---------ee-----", e);
    if (e === 'Top-Up')
      setTopUpOpen(true)
  };

  return (
    <ContainerStyled align="center" justify="space-between">
      <CardSection>
        {cardData.map((item) => (
          <StatusCard
            title={item.title}
            content={item.content}
            buttonTag={item.buttonTag}
            isButton={item.isButton}
            buttonClick={(e) => handleButtonClick(e)}
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
        we charge one time X hbars per twitter card campaign (unlimited free
        topups).
      </StatusSection>
      <PrimaryButton
        text="Create Twitter Card"
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
