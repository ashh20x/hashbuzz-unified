import Typography from "../../../Typography/Typography";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import {
  ButtonWrap,
  ButtonWrapPrimary,
  ContentWrap,
  CustomIframe,
  CustomInput,
  CustomParagraph,
  LeftSec,
  RightSec,
  TableSection,
  TextWrap,
  Wrapper,
} from "./TemplatePage.styles";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { TemplateTable } from "../../Tables/TemplateTable";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PreviewModal from "../../PreviewModal/PreviewModal";

export const TemplatePage = () => {
  let navigate = useNavigate();
  const [srcLink, setSrcLink] = useState(
    "https://www.youtube.com/embed/hm7jiV5dXcE"
  );

  const [buttonTags, setButtonTags] = useState([]);
  const [Text, setText] = useState();
  const [reply, setReply] = useState(10);
  const [retweet, setRetweet] = useState(30);
  const [like, setLike] = useState(100);
  const [download, setDownload] = useState(1000);
  const [follow, setFollow] = useState(2000);
  const [open, setOpen] = useState(false);


  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };
  const main = {
    weight: 600,
    size: "18px",
    color: "#696969",
    sizeRes: "16px",
  };
  const body = {
    weight: 400,
    size: "18px",
    color: "#696969",
    sizeRes: "16px",
  };
  const handlePreview = () => {
    // navigate("/invoice");
    setOpen(true);
  };
  const handleSubmit = () => {
    navigate("/onboarding");
  };
  const handleText = (event) => {
    const textInput = event.target.value;
    let x = textInput.split(" ").filter((item) => item[0] === "#");
    setButtonTags(x);
    setText(textInput)
  };

  const checking = (urls) => {
    let url = urls.trim();
    console.log(url);
    let videoId = "";
    if (url.indexOf("youtube") !== -1) {
      let urlParts = url.split("?v=");
      videoId = urlParts[1].substring(0, 11);
    } else if (url.indexOf("youtu.be") !== -1) {
      let urlParts = url.replace("//", "").split("/");
      videoId = urlParts[1].substring(0, 11);
    }
    if (videoId === "") {
      setSrcLink(urls);
    } else {
      setSrcLink("https://www.youtube.com/embed/" + videoId);
    }
  };
  const handleLink = (event) => {
    checking(event.target.value);
  };

  const handleReply = (e) => {
    setReply(e.target.value);
  };
  const handleRetweet = (e) => {
    setRetweet(e.target.value);
  };
  const handleLike = (e) => {
    setLike(e.target.value);
  };
  const handleDownload = (e) => {
    setDownload(e.target.value);
  };
  const handleFollow = (e) => {
    setFollow(e.target.value);
  };

  return (
    <ContainerStyled>
      <Typography theme={theme}>Template</Typography>
      <Wrapper>
        <LeftSec>
          <CustomParagraph
            onChange={handleText}
            type="textarea"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a finibus nisl, ut porta felis. Etiam vitae mollis purus. isl, ut porta felis. Etiam vitae mollis purus."
          />

          <ButtonWrap>
            {buttonTags.slice(0, 2).map((item) => (
              <SecondaryButton text={item.replace(item[0], "")} />
            ))}
            {/* <SecondaryButton text="hashbuzz" /> */}
          </ButtonWrap>
          <CustomInput
            placeholder="http/123/reward/taskbar"
            onChange={handleLink}
          />
          <TableSection>
            <TemplateTable
              handleReply={handleReply}
              handleRetweet={handleRetweet}
              handleLike={handleLike}
              handleDownload={handleDownload}
              handleFollow={handleFollow}
              reply={reply}
              retweet={retweet}
              like={like}
              download={download}
              follow={follow}
            />
          </TableSection>
        </LeftSec>
        <RightSec>
          <CustomIframe
            src={srcLink}
            id="tutorial"
            frameborder="0"
            allow="autoplay; encrypted-media"
            title="video"
          ></CustomIframe>
          <ContentWrap>
            <TextWrap>
              <Typography theme={main}>Reward scheme: </Typography>
              <Typography theme={body}>xk reply yk Retweet zk like</Typography>
            </TextWrap>
            <TextWrap>
              <Typography theme={main}>To receive reward</Typography>
              <SecondaryButton text="Connect here" />
            </TextWrap>
            <TextWrap>
              <Typography theme={main}>Campaign status:</Typography>{" "}
              <Typography theme={body}> Running</Typography>
            </TextWrap>
          </ContentWrap>
          <ButtonWrapPrimary>
            <PrimaryButton
              text="Preview"
              inverse={true}
              onclick={handlePreview}
              colors="#2546EB"
              border="1px solid #2546EB"
            />
            {/* <PrimaryButton text="Submit" onclick={handleSubmit} /> */}
          </ButtonWrapPrimary>
        </RightSec>
      </Wrapper>
      <PreviewModal
        open={open}
        setOpen={setOpen}
        Text={Text}
        buttonTags={buttonTags}
        reply={reply}
        retweet={retweet}
        like={like}
        download={download}
        follow={follow}
        srcLink={srcLink}
      />
     
    </ContainerStyled>
  );
};
