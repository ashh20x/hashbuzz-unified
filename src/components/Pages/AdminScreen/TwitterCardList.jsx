import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDappAPICall } from "../../../APIConfig/dAppApiServices";
import Image from "../../../IconsPng/arrow-symbol.png";
import Typography from "../../../Typography/Typography";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import notify from "../../Toaster/toaster";

import { TableBody, TableRow } from "@mui/material";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { APICall } from "../../../APIConfig/APIServices";
import { adminTableHeadRow } from "../../../Data/TwitterTable";
import { Loader } from "../../Loader/Loader";
import { CustomRowHead, CustomTable2, CustomTableBodyCell, CustomTableHeadCell } from "../../Tables/CreateTable.styles";
import { ImgWrap, TableSection, WrappeText } from "./TwitterCardList.styles";

export const TwitterCardScreen = () => {
  let navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [cookies, setCookie] = useCookies(["token"]);
  const [open, setOpen] = useState(false);
  const [noData, setNoData] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { dAppAPICall } = useDappAPICall();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setShowLoading(true);
      getCampaignList();
    }
    return () => (mounted = false);
  }, []);

  const getCampaignList = async () => {
    try {
      const response = await APICall("/campaign/twitter-card/pending_cards", "GET", null, null, false, cookies.token);
      if (response.data.length > 0) {
        setTableData(response.data);
        setNoData(false);
      } else {
        setTableData([]);
        setNoData(true);
      }
      setShowLoading(false);
    } catch (err) {
      console.log("/campaign/twitter-card/pending_cards:", err);
    }
  };

  const updateCampaignItem = async (data, element) => {
    try {
      setShowLoading(true);
      // await APICall("/campaign/twitter-card/card_status/", "POST", null, data, false, cookies.token);
      await dAppAPICall({
        url: "campaign/update-status",
        method: "POST",
        data,
      });
      notify(data.card_status === "Running" ? "Approved" : data.card_status);
      getCampaignList();
    } catch (err) {
      console.log("/campaign/twitter-card/card_status/:", err);
      setShowLoading(false);
    }
  };

  const handleActionButon = (key) => {
    switch (key) {
      case "Running":
        return ["Pause", "Stop"];
      case "Pending":
        return ["Approved", "Reject"];
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

  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };

  const updateBalancesForCampaign = async (card_id) => {
    try {
      await dAppAPICall({
        url: "transaction/add-campaign",
        method: "POST",
        data: {
          campaignId: card_id,
        },
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleAction = async (element, item) => {
    const updateData = {
      card_id: item.id,
      card_status: element === "Approved" ? "running" : "rejected",
    };
    await updateCampaignItem(updateData, element);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const getOwnerName = (user_id) => {
    try {
      // const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, null, false, cookies.token);
      // console.log("-------", response);
      return user_id;
    } catch (err) {
      console.log("error---", err);
    }
  };

  return (
    <ContainerStyled align="center" padding="5px" margin="12px" justify="space-between">
      <ImgWrap onClick={handleBack}>
        <img width={30} src={Image} alt="" />
      </ImgWrap>
      <Typography theme={theme}>Campaign List</Typography>
      <TableSection>
        <CustomTable2 stickyHeader aria-label="simple table">
          <CustomRowHead>
            <TableRow>
              {adminTableHeadRow.map((item) => (
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
                  {index + 1}
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.name}</CustomTableBodyCell>
                {/* <CustomTableBodyCell><a href='#' onClick={() => linkClick(item)}>Link</a></CustomTableBodyCell> */}
                <CustomTableBodyCell>
                  <p>{item.tweet_text}</p>
                </CustomTableBodyCell>
                <CustomTableBodyCell>{item.campaign_budget}</CustomTableBodyCell>
                <CustomTableBodyCell>{item?.user_user?.business_twitter_handle}</CustomTableBodyCell>
                <CustomTableBodyCell>
                  {!item.isbutton && item.card_status !== "Completed"
                    ? handleActionButon(item.card_status).map((element) => (
                        <SecondaryButton text={element} margin="5%" onclick={() => handleAction(element, item)} />
                      ))
                    : "Promotion ended"}
                </CustomTableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable2>
      </TableSection>
      {noData ? <WrappeText>No Data found!</WrappeText> : null}
      <Loader open={showLoading} />
    </ContainerStyled>
  );
};
