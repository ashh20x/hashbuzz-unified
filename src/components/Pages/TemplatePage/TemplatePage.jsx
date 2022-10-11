import Picker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { APICall } from "../../../APIConfig/APIServices";
import Typography from "../../../Typography/Typography";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import PreviewModal from "../../PreviewModal/PreviewModal";
import { TemplateTable } from "../../Tables/TemplateTable";
// import "emoji-mart/css/emoji-mart.css";
import Image from "../../../IconsPng/arrow-symbol.png";
import { ImageIcon } from "./ImageIcon";
import { ShowImage } from "./ShowImage";
import {
  ButtonWrap,
  ButtonWrapPrimary,
  CustomCheckboxInput,
  CustomIframe,
  CustomInput,
  CustomParagraph,
  EmoBtnWrap,
  ErrorTextWrap,
  IconsWrap,
  ImgWrap,
  LeftSec,
  RightSec,
  SimpleDiv,
  TableSection,
  WordsWrap,
  Wrapper,
} from "./TemplatePage.styles";
import { YoutubeIcon } from "./YoutubeIcon";
import { useStore } from "../../../Providers/StoreProvider";
export const TemplatePage = () => {
  let navigate = useNavigate();
  const [srcLink, setSrcLink] = useState("https://www.youtube.com/embed/1lzba8D4FCU");

  const [buttonTags, setButtonTags] = useState([]);
  const [Text, setText] = useState("");
  const [name, setName] = useState("");
  const [reply, setReply] = useState(0);
  const [retweet, setRetweet] = useState(0);
  const [like, setLike] = useState(0);
  const [quote, setQuote] = useState(0);
  const [follow, setFollow] = useState(0);
  const [open, setOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isYoutube, setYoutube] = useState(false);
  const [media, setMedia] = useState([]);
  const [displayMedia, setDisplayMedia] = useState([]);
  const [gifSelected, setGifSelect] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const [videoTitle, setVideoTitle] = useState(false);
  const [addMedia, setAddMedia] = useState(false);
  const [budgetMessage, setBudgetMessage] = useState("");
  const [budget, setBudget] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userData, setUserData] = useState({});

  const { state } = useStore();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserData(user);
    }
    return () => (mounted = false);
  }, []);

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
  // const handleSubmit = () => {
  //   navigate("/onboarding");
  // };
  const handleText = (event) => {
    if (271 - Text?.length === 0) {
      console.log("message for reached text enter limit!");
    }
    const textInput = event.target.value;
    let x = textInput.split(" ").filter((item) => item[0] === "#");
    setButtonTags(x);
    setText(textInput);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    let url = URL.createObjectURL(file);
    const fileType = file.type;
    setYoutube(false);
    if (media.length === 0 && fileType.includes("gif")) {
      setDisplayMedia([...displayMedia, url]);
      setGifSelect(true);
      let data = new FormData();
      data.append("media_file", file);
      data.append("media_type", "image");
      try {
        const response = await APICall("/campaign/media/", "POST", {}, data, true, cookies.token);
        setMedia([...media, response.data.id]);
      } catch (err) {
        console.error("/campaign/media/:", err);
      }
    } else if (media.length < 4 && !fileType.includes("gif") && !gifSelected) {
      try {
        setDisplayMedia([...displayMedia, url]);
        let data = new FormData();
        data.append("media_file", file);
        data.append("media_type", "image");
        try {
          const response = await APICall("/campaign/media/", "POST", {}, data, true, cookies.token);
          setMedia([...media, response.data.id]);
        } catch (err) {
          console.error("/campaign/media/:", err);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Max 4 file or gif");
    }
  };

  const handleYouTubeClick = (event) => {
    const collapseYoutube = !isYoutube;
    setYoutube(collapseYoutube);
  };

  const checking = (urls) => {
    let url = urls.trim();
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
    getYouTubeTitleAndDes(videoId);
  };

  const getYouTubeTitleAndDes = (videoId) => {
    const vidurl = "https://www.youtube.com/watch?v=" + videoId;

    fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
      .then((res) => res.json())
      .then((data) => setVideoTitle(data.title));
  };
  const handleLink = (event) => {
    checking(event.target.value);
    setMedia([event.target.value]);
    setDisplayMedia([]);
  };
  const handleClose = (event) => {};

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleBudget = (event) => {
    // 1habr = Math.pow(10,8) tinyhabrs;
    if (Math.round(event.target.value * Math.pow(10, 8)) <= state.available_budget) {
      setBudget(event.target.value);
      setBudgetMessage("");
      setButtonDisabled(false);
    } else {
      setBudgetMessage(`You have exceeded the total budget of ${userData.available_budget / Math.pow(10, 8)} ℏ`);
      setButtonDisabled(true);
    }
  };

  const handleAddMedia = (event) => {
    setAddMedia(!addMedia);
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
  const handleQuote = (e) => {
    setQuote(e.target.value);
  };
  const handleFollow = (e) => {
    setFollow(e.target.value);
  };
  const onEmojiClick = (event, emojiObject) => {
    if (271 - Text?.length >= 2) setText(Text + "" + emojiObject.emoji);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const setremoveImage = (index) => {
    displayMedia.splice(index, 1);
    media.splice(index, 1);
    const imagesArr = displayMedia.length === 0 ? [] : [...displayMedia];
    const mediaArr = media.length === 0 ? [] : [...media];
    setMedia(mediaArr);
    setDisplayMedia(imagesArr);
  };

  return (
    <ContainerStyled>
      <ImgWrap onClick={handleBack}>
        <img width={30} src={Image} alt="" />
      </ImgWrap>
      <Typography theme={theme}>Campaign</Typography>
      <Wrapper>
        <LeftSec>
          <CustomInput placeholder="Enter Campaign title" onChange={handleName} />
          <CustomParagraph onChange={handleText} value={Text} type="textarea" maxLength={271} placeholder="Start typing your tweet campaign" />
          <WordsWrap>
            <EmoBtnWrap className="button" onClick={() => setShowEmojis(!showEmojis)}>
              😊 &nbsp;
            </EmoBtnWrap>

            {271 - Text?.length == 0 ? 0 : <div>{271 - Text?.length || 271}</div>}
          </WordsWrap>
          {showEmojis && (
            <div>
              <Picker native={true} onEmojiClick={onEmojiClick} pickerStyle={{ width: "100%" }} />
            </div>
          )}
          <ButtonWrap>
            {buttonTags.slice(0, 2).map((item) => (
              <SecondaryButton text={item.replace(item[0], "")} />
            ))}
            <SecondaryButton text="hashbuzz" />
            <SecondaryButton text="TestNet" />
          </ButtonWrap>
          <TableSection>
            <TemplateTable
              handleReply={handleReply}
              handleRetweet={handleRetweet}
              handleLike={handleLike}
              handleDownload={handleQuote}
              reply={reply}
              retweet={retweet}
              like={like}
              quote={quote}
            />
          </TableSection>
        </LeftSec>
        <RightSec>
          <CustomInput
            onKeyPress={(event) => {
              if (event.code === 'Minus') {
                event.preventDefault();
              }
            }}
            step="0.1"
            type="number"
            min="1"
            placeholder="Enter campaign budget"
            onChange={handleBudget}
          />
          <ErrorTextWrap>{budgetMessage}</ErrorTextWrap>
          <IconsWrap>
            <CustomCheckboxInput type="checkbox" onChange={handleAddMedia} />
            Do you want to add media?
          </IconsWrap>
          {addMedia ? (
            <IconsWrap>
              <label for="file">
                <span>
                  {" "}
                  {/* <ImageIcon /> */}
                </span>
              </label>
              <CustomInput
                type="file"
                alt=""
                id="file"
                style={{ display: "none" }}
                accept="image/png, image/gif, image/jpeg,image/jpg, video/*"
                onChange={handleImageChange}
              />
              <label onClick={handleYouTubeClick}>
                <span>
                  <YoutubeIcon />
                </span>
              </label>
            </IconsWrap>
          ) : null}
          {isYoutube ? <CustomInput placeholder="http/123/reward/taskbar" onChange={handleLink} /> : null}

          {displayMedia.length > 0 ? (
            displayMedia.length === 3 ? (
              <IconsWrap>
                <div>
                  {displayMedia[0] ? (
                    <SimpleDiv>
                      <ShowImage ind={0} setremoveImage={() => setremoveImage} src={displayMedia[0]} alt="" />
                      <br />
                    </SimpleDiv>
                  ) : null}
                  {displayMedia[1] ? (
                    <SimpleDiv>
                      <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[1]} alt="" />{" "}
                    </SimpleDiv>
                  ) : null}
                </div>

                <IconsWrap>
                  {displayMedia[2] ? (
                    <SimpleDiv>
                      <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[2]} alt="" />
                    </SimpleDiv>
                  ) : null}
                </IconsWrap>
              </IconsWrap>
            ) : (
              <>
                <IconsWrap>
                  {displayMedia[0] ? (
                    <SimpleDiv>
                      <ShowImage ind={0} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[0]} alt="" />
                      <br />
                    </SimpleDiv>
                  ) : null}
                  {displayMedia[1] ? (
                    <SimpleDiv>
                      <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[1]} alt="" />
                      <br />{" "}
                    </SimpleDiv>
                  ) : null}
                </IconsWrap>

                <IconsWrap>
                  {displayMedia[2] ? (
                    <SimpleDiv>
                      <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[2]} alt="" />
                      <br />
                    </SimpleDiv>
                  ) : null}
                  {displayMedia[3] ? (
                    <SimpleDiv>
                      <ShowImage ind={3} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[3]} alt="" />
                    </SimpleDiv>
                  ) : null}
                </IconsWrap>
              </>
            )
          ) : addMedia ? (
            <CustomIframe src={srcLink} id="tutorial" frameborder="0" allow="autoplay; encrypted-media" title="video"></CustomIframe>
          ) : null}
          {/* <ContentWrap>
            <TextWrap>
              <Typography theme={main}>Reward scheme: </Typography>
              <Typography theme={body}>xk reply yk Retweet</Typography>
            </TextWrap>
            <TextWrap>
              <Typography theme={main}>To receive reward</Typography>
              <SecondaryButton text="Connect here" />
            </TextWrap>
            <TextWrap>
              <Typography theme={main}>Campaign status:</Typography>{" "}
              <Typography theme={body}> Running</Typography>
            </TextWrap>
          </ContentWrap> */}
          <ButtonWrapPrimary>
            <PrimaryButton
              text="Preview"
              inverse={true}
              onclick={handlePreview}
              colors="#2546EB"
              border="1px solid #2546EB"
              disabled={buttonDisabled || !budget || budget < 1}
            />
            {/* <PrimaryButton text="Submit" onclick={handleSubmit} /> */}
          </ButtonWrapPrimary>
        </RightSec>
      </Wrapper>
      <PreviewModal
        open={open}
        setOpen={setOpen}
        Text={Text + " #hashbuzz #TestNet"}
        buttonTags={buttonTags}
        reply={reply}
        retweet={retweet}
        like={like}
        follow={follow}
        srcLink={srcLink}
        name={name}
        media={media}
        displayMedia={displayMedia}
        isYoutube={isYoutube}
        videoTitle={videoTitle}
        addMedia={addMedia}
        budget={budget}
        quote={quote}
      />
    </ContainerStyled>
  );
};
