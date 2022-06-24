import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TwitterSVG from "../../../SVGR/Twitter";
import WalletSVG from "../../../SVGR/Wallet";
import Typography from "../../../Typography/Typography";
import PrimaryButton from "../../Buttons/PrimaryButton";
import Card from "../../Card/Card";
import CheckBox from "../../CheckBox/CheckBox";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import { APICall, APIAuthCall } from "../../../APIConfig/APIServices"
import {
  Brand,
  CardWrap,
  CheckboxWrap,
  Connect,
  ContentHeaderText,
  Row,
  Seperator,
  Wallet,
} from "./MainPage.styles";
import ConsentModal from "../../PreviewModal/ConsentPreviewModal";
export const MainPage = () => {
  const [open, setOpen] = useState(false);

  const theme = {
    color: "#696969",
    size: "18px",
    weight: "600",
  };
  const secondaryTheme = {
    color: "#696969",
    size: "14px",
    weight: "500",
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      console.log("main component------------");
      const href = window.location.href;
      if (href.includes('token=')) {
        const string = href.split('token=')[1];
        const token = string.split('&user_id=')[0];
        localStorage.setItem('token', token)
        const userId = string.split('&user_id=')[1];
        getUserInfo(userId)
      }
    }
    return () => mounted = false;
  }, [])
  let navigate = useNavigate();
  const getUserInfo = async (user_id) => {
    const response = await APICall("/user/profile/" + user_id + "/", "GET", {}, {});
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
      const { consent } = response.data;
      if (consent) {
        navigate("/create");
      }
      else {
        setOpen(true);
      }
    }
  }

  const submitClick = async() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    const user_data = {
      ...userInfo,
      "consent": true
    }
    const response = await APICall("/user/profile/" + userInfo.id + "/", "PATCH", {}, user_data);
    if (response.data) {
      navigate("/create");
    }
  }

  const clickNo = () => {
    // Alert('You need to Accept consent!');
  }

  const login = () => {
    (async () => {

      try {
        const response = await APIAuthCall("/user/twitter-login/", "GET", {}, {});
        if (response.data) {
          const { url } = response.data;
          window.location.href = url
          // localStorage.setItem('token', token)
          // localStorage.setItem('user', JSON.stringify(user))
          // console.log(token)
          // navigate("/create");
        }
      } catch (error) {
        console.error("error===", error);
      }

    })();
  }

  // const authHandler = (err, data) => {
  //   console.log(err, data);
  // };

  return (
    <ContainerStyled>
      <ContentHeaderText>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu iaculis
        urna, nec vestibulum elit. Praesent quam risus, varius vel venenatis
        non, elementum at sapien. Maecenas feugiat dictum tortor, in tincidunt
        metus dignissim eget. Pellentesque quis tincidunt quam. Integer a nibh
        nec ante imperdiet vehicula. Duis ac velit vel nulla pellentesque porta
        vel vel massa. Quisque tellus ante, ultricies vel ipsum id, bibendum
        suscipit mi. Nunc ullamcorper dolor tortor, vitae bibendum lectus
        elementum convallis. Praesent quam nisl, pellentesque ac massa placerat,
        tempus fermentum ligula. Nulla facilisi. Praesent consectetur dapibus
        interdum.
      </ContentHeaderText>

      <Connect>
        <Wallet>
          <Typography theme={theme}>Connect your wallet</Typography>
          <Row />
          <div onClick={() => login()}>
            <Card title="Connect Twitter" icon={<TwitterSVG />} />
          </div>
          {/* <Card title="Connect HashPack" icon={<WalletSVG />} /> */}
        </Wallet>
        {/* <Seperator /> */}
        {/* <Brand>
          <Typography theme={theme}>Connect your brand</Typography>
          <CheckboxWrap style={{ display: "flex" }}>
            <Row>
              <>
                <CheckBox />
              </>
              <>
                <Typography theme={secondaryTheme}>
                  I want to run a campaign
                </Typography>
              </>
            </Row>
            <Row>
              <>
                <CheckBox />
              </>
              <>
                <Typography theme={secondaryTheme}>
                  I want to earn hbars
                </Typography>
              </>
            </Row>
          </CheckboxWrap>
          <CardWrap style={{ display: "flex" }}>
            <Card title="Connect Twitter" icon={<TwitterSVG />} />
            <Card
              title={`Enter Personal Twitter Handle`}
              icon={<TwitterSVG />}
            />
          </CardWrap>
        </Brand> */}
      </Connect>
      <div>
        {/* <ReactTwitterLogin
          authCallback={authHandler}
          consumerKey='70jT2zeMdbbhGinO7R9TM8rmP'
          consumerSecret='hS6iMJXxR1LmI8MKvwIilW476Kb2h25ej9dZoxhvtQICn5BioG'
          children={<PrimaryButton text="Start" variant="contained" onclick={handleStart} />}
        /> */}
        {/* <PrimaryButton text="Start" variant="contained" onclick={login} /> */}
      </div>
      <ConsentModal
        open={open}
        setOpen={setOpen}
        submit={submitClick}
        noClick={clickNo}
      />
    </ContainerStyled>

  );
};
