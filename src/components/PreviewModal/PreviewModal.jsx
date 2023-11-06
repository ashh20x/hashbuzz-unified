import { Dialog } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDappAPICall } from "../../APIConfig/dAppApiServices";
import Typography from "../../Typography/Typography";
import PrimaryButton from "../Buttons/PrimaryButton";
import { Loader } from "../Loader/Loader";
import ModalTable from "../Tables/ModalTable";
import notify from "../Toaster/toaster";
import {
  BoxCont,
  ButtonWrapPrimary,
  CustomIframe,
  CustomParagraph,
  IconsWrap,
  LeftSec,
  RightSec,
  TableSection,
  TextWrap,
  Wrapper,
} from "./PreviewModal.styles";
import { useApiInstance } from "../../APIConfig/api";
import { toast } from "react-toastify";
import { useStore } from "../../Store/StoreProvider";
const PreviewModal = ({
  type,
  open,
  setOpen,
  Text,
  reply,
  selectedToken,
  tokenId,
  retweet,
  like,
  follow,
  srcLink,
  name,
  displayMedia,
  media,
  videoTitle,
  addMedia,
  budget,
  quote,
}) => {
  let navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [showLoading, setShowLoading] = useState(false);
  const { dAppAPICall } = useDappAPICall();
  const store = useStore();
  const { Campaign } = useApiInstance();
  const handleClose = () => setOpen(false);
  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };
  const body = {
    weight: 700,
    size: "16px",
    color: "#000",
    sizeRes: "16px",
  };

  const handleSubmit = async () => {
    setShowLoading(true);
    const postData = {
      name: name,
      tweet_text: Text,
      "fungible_token_id": type === 'HBAR' ? "" : selectedToken,
      comment_reward: reply,
      retweet_reward: retweet,
      like_reward: like,
      type: type,
      quote_reward: quote,
      // "follow_reward": follow,
      campaign_budget: budget == "" ? 0 : budget,
      media: media,
    };
    try {
      // const response = await APICall("/campaign/twitter-card/", "POST", {}, postData, false, cookies.token);
      const response = await Campaign.addCampaign(postData);
      if (response) {
        toast.success(response.message);
        setShowLoading(false);
        navigate("/dashboard");
        // navigate("/onboarding");
      }
    } catch (err) {
      console.error("campaign/add-new/:", err);
      setShowLoading(false);
      notify("Something went wrong! Please try again later");
    }
  };
  let currentToken = store?.balances?.filter(item =>
    item?.entityId === selectedToken
  );
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: 11,
          padding: 0,
          width: "100%",
          height: "100%",
          maxWidth: 1010,
          minWidth: 350,
          maxHeight: 655,
          scrollbarWidth: "none",
        },
      }}
    >
      <BoxCont>
        <Typography theme={theme}>Tweet campaign preview</Typography>
        <Wrapper>
          <LeftSec>
            {/* <CustomParagraph>{name}</CustomParagraph> */}
            <CustomParagraph>{Text}</CustomParagraph>
            {displayMedia.length > 0 && addMedia ? (
              displayMedia.length === 3 ? (
                <IconsWrap>
                  <div>
                    {displayMedia[0] ? (
                      <>
                        <img width={150} src={displayMedia[0]} alt="" />
                        <br />
                      </>
                    ) : null}
                    {displayMedia[1] ? <img width={150} src={displayMedia[1]} alt="" /> : null}
                  </div>

                  <IconsWrap>{displayMedia[2] ? <img width={200} src={displayMedia[2]} alt="" /> : null}</IconsWrap>
                </IconsWrap>
              ) : (
                <IconsWrap>
                  <div>
                    {displayMedia[0] ? (
                      <>
                        <img width={150} src={displayMedia[0]} alt="" />
                        <br />
                      </>
                    ) : null}
                    {displayMedia[1] ? <img width={150} src={displayMedia[1]} alt="" /> : null}
                  </div>

                  <div>
                    {displayMedia[2] ? (
                      <>
                        <img width={150} src={displayMedia[2]} alt="" />
                        <br />
                      </>
                    ) : null}
                    {displayMedia[3] ? <img width={150} src={displayMedia[3]} alt="" /> : null}
                  </div>
                </IconsWrap>
              )
            ) : addMedia ? (
              <CustomIframe src={srcLink} id="tutorial" frameborder="0" allow="autoplay; encrypted-media" title="video"></CustomIframe>
            ) : null}
            <TextWrap>
              <Typography theme={body}>{videoTitle}</Typography>
            </TextWrap>

            {/* <CustomParagraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a
              finibus nisl, ut porta felis. Etiam vitae mollis purus. isl, ut
              porta felis. Etiam vitae mollis purus.
            </CustomParagraph> */}
          </LeftSec>
          <RightSec>
            <TableSection>
              <ModalTable currentToken={currentToken} reply={reply} retweet={retweet} like={like} quote={quote} />
            </TableSection>
            <CustomParagraph>Campaign Budget: {budget}</CustomParagraph>
            <CustomParagraph>
              Warning: you will not be able to edit this tweet if you click submit as this feature is not available in Twitter yet, we recommend you
              read your tweet information and reward table carefully before submitting your campaign.
            </CustomParagraph>
            <ButtonWrapPrimary>
              <PrimaryButton text="Cancel & Edit" inverse={true} onclick={handleClose} colors="#EF5A22" border="1px solid #EF5A22" />
              <PrimaryButton text="Submit" onclick={handleSubmit} />
            </ButtonWrapPrimary>
          </RightSec>
        </Wrapper>
      </BoxCont>
      <Loader open={showLoading} />
    </Dialog>
  );
};

export default PreviewModal;
