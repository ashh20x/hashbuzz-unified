import Picker from 'emoji-picker-react';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { APICall } from '../../../APIConfig/APIServices';
import Typography from "../../../Typography/Typography";
import PrimaryButton from "../../Buttons/PrimaryButton";
import SecondaryButton from "../../Buttons/SecondaryButton";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import PreviewModal from "../../PreviewModal/PreviewModal";
import { TemplateTable } from "../../Tables/TemplateTable";
// import "emoji-mart/css/emoji-mart.css"; 
import { ImageIcon } from "./ImageIcon";
import {
  ButtonWrap,
  ButtonWrapPrimary,
  ContentWrap,
  CustomIframe,
  CustomInput,
  CustomParagraph, EmoBtnWrap,
  IconsWrap, LeftSec,
  RightSec,
  TableSection,
  TextWrap, WordsWrap, Wrapper
} from "./TemplatePage.styles";
import { YoutubeIcon } from "./YoutubeIcon";

export const TemplatePage = () => {
  let navigate = useNavigate();
  const [srcLink, setSrcLink] = useState(
    "https://www.youtube.com/embed/hm7jiV5dXcE"
  );

  const [buttonTags, setButtonTags] = useState([]);
  const [Text, setText] = useState('');
  const [name, setName] = useState('');
  const [reply, setReply] = useState(10);
  const [retweet, setRetweet] = useState(30);
  const [like, setLike] = useState(100);
  const [download, setDownload] = useState(1000);
  const [follow, setFollow] = useState(2000);
  const [open, setOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isYoutube, setYoutube] = useState(false);
  const [media, setMedia] = useState([]);
  const [displayMedia, setDisplayMedia] = useState([]);
  const [gifSelected, setGifSelect] = useState(false);
  const [cookies, setCookie] = useCookies(['token']);




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
    // if(Text.length<270)
    setText(textInput)
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    let url = URL.createObjectURL(file);
    const fileType = file.type;
    setYoutube(false);
    if (media.length === 0 && fileType.includes('gif')) {
      setDisplayMedia([...displayMedia, url])
      setGifSelect(true);
      let data = new FormData();
      data.append('media_file', file);
      data.append('media_type', 'image');
      try {
        const response = await APICall('/campaign/media/', 'POST', {}, data, true, cookies.token);
        setMedia([...media, response.data.id]);
      }
      catch (err) {
        console.error("/campaign/media/:", err)
      }

    }
    else if (media.length < 4 && !fileType.includes('gif') && !gifSelected) {
      try {
        setDisplayMedia([...displayMedia, url])
        let data = new FormData();
        data.append('media_file', file);
        data.append('media_type', 'image');
        try {
          const response = await APICall('/campaign/media/', 'POST', {}, data, true, cookies.token);
          setMedia([...media, response.data.id])
        }
        catch (err) {
          console.error("/campaign/media/:", err)
        }
      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      console.log('Max 4 file or gif');
    }
  };

  const handleYouTubeClick = (event) => {
    console.log(event)
    setYoutube(true)
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
    setMedia([]);
    setDisplayMedia([]);
  };

  const handleName = (event) => {
    setName(event.target.value);
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
  const onEmojiClick = (event, emojiObject) => {
    // if(Text.length<270)
    setText([Text + ' ' + emojiObject.emoji]);
  };

  return (
    <ContainerStyled>
      {console.log(media)}
      <Typography theme={theme}>Template</Typography>
      <Wrapper>
        <LeftSec>
          <CustomInput
            placeholder="Enter name"
            onChange={handleName}
          />
          <CustomParagraph
            onChange={handleText}
            value={Text}
            type="textarea"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a finibus nisl, ut porta felis. Etiam vitae mollis purus. isl, ut porta felis. Etiam vitae mollis purus."
          />
          <WordsWrap>
            <EmoBtnWrap className="button" onClick={() => setShowEmojis(!showEmojis)}>😊 </EmoBtnWrap>
            <div>{272 - Text?.length || 272}</div>
          </WordsWrap>
          {showEmojis && (
            <div>
              <Picker native={true} onEmojiClick={onEmojiClick} pickerStyle={{ width: '100%' }} />

            </div>
          )}
          <ButtonWrap>
            {buttonTags.slice(0, 2).map((item) => (
              <SecondaryButton text={item.replace(item[0], "")} />
            ))}
            {/* <SecondaryButton text="hashbuzz" /> */}
          </ButtonWrap>
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
          <IconsWrap>
            <label for="file"><span> <ImageIcon /></span></label>
            <CustomInput type="file" alt="" id="file" style={{ display: 'none' }} accept="image/png, image/gif, image/jpeg" onChange={handleImageChange} />
            <label onClick={handleYouTubeClick}><span>
              <YoutubeIcon />
            </span></label>
          </IconsWrap>
          {isYoutube ?
            <CustomInput
              placeholder="http/123/reward/taskbar"
              onChange={handleLink}
            />
            : null}
          {
            displayMedia.length > 0 ?
              <IconsWrap>
                {displayMedia[0] ? <img width={100} src={displayMedia[0]} alt="" /> : null}
                {displayMedia[1] ? <img width={100} src={displayMedia[1]} alt="" /> : null}
                {displayMedia[2] ? <img width={100} src={displayMedia[2]} alt="" /> : null}
                {displayMedia[3] ? <img width={100} src={displayMedia[3]} alt="" /> : null}
              </IconsWrap>
              :
              <CustomIframe
                src={srcLink}
                id="tutorial"
                frameborder="0"
                allow="autoplay; encrypted-media"
                title="video"
              ></CustomIframe>
          }
          <ContentWrap>
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
        name={name}
        media={media}
        displayMedia={displayMedia}
        isYoutube={isYoutube}
      />

    </ContainerStyled>
  );
};
