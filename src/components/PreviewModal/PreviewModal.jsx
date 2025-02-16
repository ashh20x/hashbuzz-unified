import { Dialog } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useApiInstance } from "../../APIConfig/api";
import { useStore } from "../../Store/StoreProvider";
import Typography from "../../Typography/Typography";
import PrimaryButton from "../Buttons/PrimaryButton";
import { Loader } from "../Loader/Loader";
import ModalTable from "../Tables/ModalTable";
import notify from "../Toaster/toaster";
import { BoxCont, ButtonWrapPrimary, CustomIframe, CustomParagraph, IconsWrap, LeftSec, RightSec, TableSection, TextWrap, Wrapper } from "./PreviewModal.styles";
const PreviewModal = ({ type, open, setOpen, Text, reply, selectedToken, tokenId, retweet, like, follow, srcLink, name, displayMedia, media, videoTitle, addMedia, budget, quote }) => {
  let navigate = useNavigate();

  const [showLoading, setShowLoading] = useState(false);

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
    let postData = new FormData();
    postData.append("name", name);
    postData.append("tweet_text", Text);
    postData.append("fungible_token_id", type === "HBAR" ? "" : selectedToken);
    postData.append("comment_reward", reply);
    postData.append("retweet_reward", retweet);
    postData.append("like_reward", like);
    postData.append("type", type);
    postData.append("quote_reward", quote);
    postData.append("campaign_budget", budget === "" ? 0 : budget);

    if (addMedia && displayMedia.length > 0) {
      console.log("displayMedia", displayMedia);

      const files = [];

      for (let index = 0; index < displayMedia.length; index++) {
        const mediaItem = displayMedia[index];
        console.log("mediaItem", mediaItem);
        try {
          const response = await fetch(mediaItem);
          if (!response.ok) {
            throw new Error(`Failed to fetch media item: ${response.statusText}`);
          }
          const blob = await response.blob();
          const fileType = blob.type.split("/")[1]; // Get file extension
          const file = new File([blob], `media-${index}.${fileType}`, { type: blob.type });
          console.log("file", file);

          // Append each file separately
          // postData.append(`media`, file);
          files.push(file);
        } catch (error) {
          console.error(`Error fetching media item at index ${index}:`, error);
          setShowLoading(false);
          notify("Something went wrong while fetching media! Please try again later");
          return;
        }
      }

      postData.append("media", files);
    }

    try {
      console.log("postData-updated", postData);
      const response = await Campaign.addCampaign(postData);
      if (response) {
        toast.success(response.message);
        setShowLoading(false);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("campaign/add-new/:", err);
      setShowLoading(false);
      notify("Something went wrong! Please try again later");
    }
  };

  let currentToken = store?.balances?.filter((item) => item?.entityId === selectedToken);
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
          </LeftSec>
          <RightSec>
            <TableSection>
              <ModalTable currentToken={currentToken} reply={reply} retweet={retweet} like={like} quote={quote} type={type} />
            </TableSection>
            <CustomParagraph>Campaign Budget: {budget}</CustomParagraph>
            <CustomParagraph>Warning: you will not be able to edit this tweet if you click submit as this feature is not available in Twitter yet, we recommend you read your tweet information and reward table carefully before submitting your campaign.</CustomParagraph>
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
