import * as React from "react";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
  BoxCont,
  ButtonWrapPrimary,
  CustomIframe,
  CustomParagraph,
  LeftSec,
  RightSec,
  TableSection,
  TextWrap,
  Wrapper,
} from "./PreviewModal.styles";
import { TemplateTable } from "../Tables/TemplateTable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Typography from "../../Typography/Typography";
import ModalTable from "../Tables/ModalTable";
import { APICall, APIAuthCall } from "../../APIConfig/APIServices"

const PreviewModal = ({
  open,
  setOpen,
  Text,
  buttonTags,
  reply,
  retweet,
  like,
  download,
  follow,
  srcLink,
}) => {
  let navigate = useNavigate();
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

  const handleSubmit = async() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const postData = {
      "campaign": 1,
      "tweet_text": Text,
      "replay_reward": reply,
      "retweet_reward": retweet,
      "like_reward": like,
      "like_downloaded_reward": download,
      "follow_reward": follow
  }
    const response = await APICall("/campaign/twitter-card/" + userInfo.id + "/", "POST", {}, postData);
    if (response.data) {
      // navigate("/create");
      navigate("/onboarding");
    }
  };

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
        <Typography theme={theme}>Twitter card preview</Typography>
        <Wrapper>
          <LeftSec>
            <CustomParagraph>{Text}</CustomParagraph>
            <CustomIframe
              src={srcLink}
              id="tutorial"
              frameborder="0"
              allow="autoplay; encrypted-media"
              title="video"
            ></CustomIframe>
            <TextWrap>
            <Typography theme={body}>Video Tiltle here</Typography>
            </TextWrap>
            <CustomParagraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a
              finibus nisl, ut porta felis. Etiam vitae mollis purus. isl, ut
              porta felis. Etiam vitae mollis purus.
            </CustomParagraph>
          </LeftSec>
          <RightSec>
            <TableSection>
              <ModalTable
                reply={reply}
                retweet={retweet}
                like={like}
                download={download}
                follow={follow}
              />
            </TableSection>
              <CustomParagraph>
                As per twitter low you couldn't edit twitter's twwet. So before
                posting this card to twitter read it carefully and then submit
                to the twiter.
              </CustomParagraph>
            <ButtonWrapPrimary>
              <PrimaryButton
                text="Cancel & Edit"
                inverse={true}
                onclick={handleClose}
                colors="#EF5A22"
                border="1px solid #EF5A22"
              />
              <PrimaryButton text="Submit" onclick={handleSubmit} />
            </ButtonWrapPrimary>
          </RightSec>
        </Wrapper>
      </BoxCont>
    </Dialog>
  );
};

export default PreviewModal;
