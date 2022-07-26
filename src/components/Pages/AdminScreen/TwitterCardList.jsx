import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { cardData } from "../../../Data/Cards";

import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";

import {
  TableSection,
  WrappeText
} from "./TwitterCardList.styles";
import { TableRow, TableBody } from "@mui/material";
import { adminTableHeadRow } from "../../../Data/TwitterTable";
import {
  CustomRowHead,
  CustomTable2,
  CustomTableBodyCell,
  CustomTableHeadCell,
  
} from "../../Tables/CreateTable.styles";
import { APICall, APIAuthCall } from "../../../APIConfig/APIServices";

import { useCookies } from 'react-cookie';

export const TwitterCardScreen = () => {
  const [tableData, setTableData] = useState([]);

  const [cookies, setCookie] = useCookies(['token']);
  const [open, setOpen] = useState(false);
  const [noData, setNoData] = useState(false);


  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getCampaignList();
    }
    return () => mounted = false;
  }, [])


  const getCampaignList = async () => {
    try {
      const response = await APICall("/campaign/twitter-card/pending_cards", "GET", null, null, false, cookies.token);
      if (response.data.length>0) {
        setTableData(response.data);
        setNoData(false);
      }
      else {
        setNoData(true);
      }
    }
    catch (err) {
      console.log("/campaign/twitter-card/pending_cards:", err)
    }
  };

  const updateCampaignItem = async (data) => {
    try {
      await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      getCampaignList();
    }
    catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err)
    }
  };

  const handleActionButon = (key) => {
    switch (key) {
      case "Running":
        return ['Pause', "Stop"]
      case "Pending":
        return ['Approved', 'Reject']
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

  const handleAction = (element, item) => {
    console.log(element)
    console.log(item)
    const updateData = {
      "card_id": item.id,
      "card_status": element === "Approved" ? "Running" : "Rejected"
    }
    updateCampaignItem(updateData);
  };

  const linkClick = (item) => {
    console.log("item:", item);
    setOpen(true);
    // navigate("/invoice");
  };


  const handleButtonClick = (e, i) => {
    if (e === 'Top-Up') {
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
    <ContainerStyled align="center" padding="5px" margin="12px" justify="space-between">

      <TableSection>
        <CustomTable2 stickyHeader aria-label="simple table">
          <CustomRowHead>
            <TableRow>
              {adminTableHeadRow.map((item) => (
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
                {/* <CustomTableBodyCell><a href='#' onClick={() => linkClick(item)}>Link</a></CustomTableBodyCell> */}
                <CustomTableBodyCell><p>{item.tweet_text}</p></CustomTableBodyCell>
                <CustomTableBodyCell>{item.campaign_budget}</CustomTableBodyCell>
                {/* <CustomTableBodyCell>{item.amount_claimed}</CustomTableBodyCell> */}
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
      {noData?<WrappeText>No Data found!</WrappeText>:null}
    </ContainerStyled>
  );
};
