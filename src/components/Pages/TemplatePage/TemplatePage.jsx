import { Icon, MenuItem, Select } from "@mui/material";
import { Image as ImageIcon } from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiInstance } from "../../../APIConfig/api";
import Image from "../../../IconsPng/arrow-symbol.png";
import { useStore } from "../../../Store/StoreProvider";
import Typography from "../../../Typography/Typography";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import PreviewModal from "../../PreviewModal/PreviewModal";
import { TemplateTable } from "../../Tables/TemplateTable";
import { ShowImage } from "./ShowImage";
import { ButtonWrap, ButtonWrapPrimary, CustomCheckboxInput, CustomIframe, CustomInput, CustomParagraph, EmoBtnWrap, ErrorTextWrap, IconsWrap, ImgWrap, LeftSec, RightSec, SimpleDiv, TableSection, WordsWrap, Wrapper } from "./TemplatePage.styles";
import { YoutubeIcon } from "./YoutubeIcon";

export const TemplatePage = () => {
  let navigate = useNavigate();
  const [srcLink, setSrcLink] = useState("https://www.youtube.com/embed/1lzba8D4FCU");

  const [buttonTags, setButtonTags] = useState([]);
  const [Text, setText] = useState("");
  const [name, setName] = useState("");
  const [reply, setReply] = useState(0);
  const [tokenId, setTokenId] = useState("");
  const [retweet, setRetweet] = useState(0);
  const [like, setLike] = useState(0);
  const [quote, setQuote] = useState(0);
  const [follow, setFollow] = useState(0);
  const [type, setType] = useState("HBAR");
  const [open, setOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isYoutube, setYoutube] = useState(false);
  const [media, setMedia] = useState(["https://www.youtube.com/watch?time_continue=1&v=1lzba8D4FCU&embeds_referring_euri=http%3A%2F%2Flocalhost%3A3000%2F&source_ve_path=Mjg2NjY&feature=emb_logo"]);
  const [displayMedia, setDisplayMedia] = useState([]);
  const [medeiaFile , setMediaFile] = useState([]);
  const [gifSelected, setGifSelect] = useState(false);
  const [videoTitle, setVideoTitle] = useState(false);
  const { User } = useApiInstance();
  const [addMedia, setAddMedia] = useState(false);
  const [budgetMessage, setBudgetMessage] = useState("");
  const [budget, setBudget] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allTokens, setAllTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(allTokens?.[0]?.value);
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorTextMessage, setErrorTextMessage] = useState("");
  const [uploadedfile ] = useState(false);


  const getTokens = async () => {
    const response = await User.getTokenBalances();
    const updatedTokens = [];
    response?.forEach((item) => {
      updatedTokens.push({
        value: item?.token_id,
        token_symbol: item?.token_symbol,
        tokenBalance: item?.available_balance ?? 0,
      });
    });
    setAllTokens(updatedTokens);
  };
  const store = useStore();

  const theme = {
    weight: 500,
    size: "36px",
    color: "#000000",
    sizeRes: "28px",
  };
  const handlePreview = () => {
    setOpen(true);
  };

  const handleText = (event) => {
    if (271 - Text?.length === 0) {
      console.log("message for reached text enter limit!");
    }
    const textInput = event.target.value;
    let x = textInput.split(" ").filter((item) => item[0] === "#");
    setButtonTags(x);
    setText(textInput);
    if (event.target.value === "") {
      setErrorTextMessage("Please enter some value");
    } else {
      setErrorTextMessage("");
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const fileType = file.type;
    setYoutube(false);

    if (media.length === 0 && fileType.includes("gif")) {
      setDisplayMedia([...displayMedia, url]);
      setGifSelect(true);
    } else if (media.length < 4 && !fileType.includes("gif") && !gifSelected) {
      setDisplayMedia([...displayMedia, url]);
    } else {
      console.log("Max 4 files or gif");
      return;
    }

    const data = new FormData();
    data.append("media_file", file);
    data.append("media_type", "image");
    setMediaFile(prevdata => ([...prevdata, {file: file, type: fileType}]));

    try {
      // Add your API call here
    } catch (err) {
      console.error("/campaign/media/:", err);
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
      videoId = urlParts?.[1]?.substring(0, 11);
    } else if (url?.indexOf("youtu.be") !== -1) {
      let urlParts = url?.replace("//", "")?.split("/");
      videoId = urlParts[1]?.substring(0, 11);
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

  const handleName = (event) => {
    console.log(event.target.value);
    setName(event.target.value);
    if (event.target.value === "") {
      setErrorNameMessage("Please enter some value");
    } else {
      setErrorNameMessage("");
    }
  };

  const handleBudget = (event) => {
    // 1habr = Math.pow(10,8) tinyhabrs;
    console.log(event.target.value);
    if (type === "HBAR") {
      if (Math.round(event.target.value * Math.pow(10, 8)) <= store?.currentUser?.available_budget) {
        setBudget(event.target.value);
        setBudgetMessage("");
        setButtonDisabled(false);
      } else {
        setBudgetMessage(`You have exceeded the total budget of ${store?.currentUser?.available_budget / Math.pow(10, 8)} ℏ`);
        setButtonDisabled(true);
      }
    } else {
      console.log(store?.balances, selectedToken, "store?.balances?.[selectedToken]?.entityBalance");
      let currentToken = store?.balances?.filter((item) => item?.entityId === selectedToken);
      if (Number(event.target.value) <= currentToken?.[0]?.entityBalance) {
        setBudget(event.target.value);
        setBudgetMessage("");
        setButtonDisabled(false);
      } else {
        setBudgetMessage(`You have exceeded the total budget of ${currentToken?.[0]?.entityBalance} ${currentToken?.[0]?.entityIcon}`);
        setButtonDisabled(true);
      }
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
  const inputSelectChangeHandler = (event) => {
    event.preventDefault();
    setType(event.target.value);
  };

  const selectTokenIdHandler = (event) => {
    event.preventDefault();
    setSelectedToken(event.target.value);
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log(event, emojiObject, "obj");
    if (268 - Text?.length >= 2) setText(Text + "" + event.emoji);
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



  useEffect(() => {
    setSelectedToken(allTokens?.[0]?.value);
  }, [allTokens]);
  useEffect(() => {
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContainerStyled>
      <ImgWrap onClick={handleBack}>
        <img width={30} src={Image} alt="" />
      </ImgWrap>
      <Typography theme={theme}>Campaign</Typography>
      <Wrapper>
        <LeftSec>
          <CustomInput style={{ width: "100%", height: "100px" }} placeholder="Enter Campaign title" onChange={handleName} required />
          <ErrorTextWrap>{errorNameMessage}</ErrorTextWrap>
          <Select style={{ margin: "20px 0" }} labelId="token_type" id="token_type" value={type} label="Age" onChange={inputSelectChangeHandler}>
            <MenuItem value={"FUNGIBLE"}>Fungible</MenuItem>
            <MenuItem value={"HBAR"}>HBAR</MenuItem>
          </Select>
          {type === "FUNGIBLE" && (
            <Select style={{ margin: "20px 0" }} labelId="token_id" id="token_id" placeholder="Select Token Id" value={selectedToken} label="Token Id" onChange={selectTokenIdHandler}>
              {allTokens?.map((item) => (
                <MenuItem key={item?.value} value={item?.value} disabled={item.tokenBalance <= 0}>
                  {`${item.tokenBalance} - ${item?.token_symbol} - ${item?.value}`}
                </MenuItem>
              ))}
            </Select>
          )}
          <CustomParagraph onChange={handleText} value={Text} type="textarea" maxLength={270} placeholder="Start typing your tweet campaign" required />
          <ErrorTextWrap>{errorTextMessage}</ErrorTextWrap>
          <WordsWrap>
            <EmoBtnWrap className="button" onClick={() => setShowEmojis(!showEmojis)}>
              😊 &nbsp;
            </EmoBtnWrap>
            {270 - Text?.length === 0 ? 0 : <div>{270 - Text?.length || 270}</div>}
          </WordsWrap>
          {showEmojis && (
            <div>
              <Picker native={true} onEmojiClick={onEmojiClick} pickerStyle={{ width: "100%" }} />
            </div>
          )}
          <ButtonWrap>
            {buttonTags.map((item) => (
              <SecondaryButton key={item} text={item.replace(item[0], "")} />
            ))}
          </ButtonWrap>
          <TableSection>
            <TemplateTable handleReply={handleReply} handleRetweet={handleRetweet} handleLike={handleLike} handleDownload={handleQuote} reply={reply} selectedToken={selectedToken} type={type} retweet={retweet} like={like} quote={quote} />
          </TableSection>
        </LeftSec>
        <RightSec>
          <CustomInput step="0.1" type="number" required min="1" placeholder="Enter campaign budget" onChange={handleBudget} />
          <ErrorTextWrap>{budgetMessage}</ErrorTextWrap>
          <IconsWrap>
            <CustomCheckboxInput type="checkbox" onChange={handleAddMedia} />
            Do you want to add media?
          </IconsWrap>
          {addMedia && (
            <>
              <IconsWrap>
                <label htmlFor="file">
                  <span>
                    <ImageIcon />
                  </span>
                </label>
                <CustomInput type="file" alt="" id="file" style={{ display: "none", visibility: "hidden", opacity: 0 }} accept="image/png, image/gif, image/jpeg,image/jpg" onChange={handleImageChange} />
                <label onClick={handleYouTubeClick}>
                  <span>
                    <YoutubeIcon />
                  </span>
                </label>
              </IconsWrap>
              <CustomInput placeholder="http/123/reward/taskbar" value={media} onChange={handleLink} />
              {displayMedia.length > 0 ? (
                displayMedia.length === 3 ? (
                  <IconsWrap>
                    <div>
                      {displayMedia[0] && (
                        <SimpleDiv>
                          <ShowImage ind={0} setremoveImage={() => setremoveImage} src={displayMedia[0]} alt="" />
                          <br />
                        </SimpleDiv>
                      )}
                      {displayMedia[1] && (
                        <SimpleDiv>
                          <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[1]} alt="" />
                        </SimpleDiv>
                      )}
                    </div>
                    <IconsWrap>
                      {displayMedia[2] && (
                        <SimpleDiv>
                          <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[2]} alt="" />
                        </SimpleDiv>
                      )}
                    </IconsWrap>
                  </IconsWrap>
                ) : (
                  <>
                    <IconsWrap>
                      {displayMedia[0] && (
                        <SimpleDiv>
                          <ShowImage ind={0} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[0]} alt="" />
                          <br />
                        </SimpleDiv>
                      )}
                      {displayMedia[1] && (
                        <SimpleDiv>
                          <ShowImage ind={1} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[1]} alt="" />
                          <br />
                        </SimpleDiv>
                      )}
                    </IconsWrap>
                    <IconsWrap>
                      {displayMedia[2] && (
                        <SimpleDiv>
                          <ShowImage ind={2} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[2]} alt="" />
                          <br />
                        </SimpleDiv>
                      )}
                      {displayMedia[3] && (
                        <SimpleDiv>
                          <ShowImage ind={3} setremoveImage={(i) => setremoveImage(i)} src={displayMedia[3]} alt="" />
                        </SimpleDiv>
                      )}
                    </IconsWrap>
                  </>
                )
              ) : (
                addMedia && <CustomIframe src={srcLink} id="tutorial" frameBorder="0" allow="autoplay; encrypted-media" title="video"></CustomIframe>
              )}
            </>
          )}
          <ButtonWrapPrimary>
            <PrimaryButton text="Preview" inverse={true} onclick={handlePreview} colors="#2546EB" border="1px solid #2546EB" disabled={buttonDisabled || !budget || !name || !Text} />
          </ButtonWrapPrimary>
        </RightSec>
      </Wrapper>
      <PreviewModal open={open} setOpen={setOpen} Text={Text + " #hashbuzz"} buttonTags={buttonTags} reply={reply} tokenId={tokenId} retweet={retweet} type={type} like={like} selectedToken={selectedToken} follow={follow} srcLink={srcLink} name={name} media={media} displayMedia={displayMedia} isYoutube={isYoutube} videoTitle={videoTitle} addMedia={addMedia} budget={budget} quote={quote} mediaFile={medeiaFile} />
    </ContainerStyled>
  );
};
