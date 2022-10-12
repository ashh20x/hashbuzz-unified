import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDappAPICall } from '../../../APIConfig/dAppApiServices';
import TwitterSVG from "../../../SVGR/Twitter";
import Typography from "../../../Typography/Typography";
import Card from "../../Card/Card";
import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import { Loader } from '../../Loader/Loader';
import {
  CardContainer, Connect,
  ContentHeaderText,
  Row, Wallet
} from "./MainPage.styles";
import { mainText1, mainText2 } from './mainText';
export const MainPage = () => {
  const [open, setOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['token', "refreshToken"]);
  const [userData, setUserData] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const {dAppAuthAPICall} = useDappAPICall();

  const theme = {
    color: "#696969",
    size: "18px",
    weight: "600",
  };
  let navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const params = (new URL(document.location)).searchParams;
      const token = params.get('token'); 
      const refreshToken = params.get("refreshToken");
      const userId = params.get("user_id");
      if (token && refreshToken) {
        setCookie('token', token);
        setCookie('refreshToken', refreshToken);
        localStorage.setItem("user_id",userId)
        // getUserInfo(userId, token);
        navigate("/dashboard");
      }else{
        toast.error("Something wrong happens try again");
        navigate("/")
      }
    }
    return () => mounted = false;
  }, [userData])


  const login = () => {
    (async () => {
      setShowLoading(true)
      try {
        // const response = await APIAuthCall("/user/twitter-login/", "GET", {}, {});
        const response = await dAppAuthAPICall({
          url:"twitter-login",
          method:"GET"
        })
        if (response.url) {
          localStorage.setItem('firstTime',true)
          const  url = response.url;
          window.location.href = url;

        }
      } catch (error) {
        console.error("error===", error);
        setShowLoading(false)
      }

    })();
  }


  return (
    <ContainerStyled>
      <ContentHeaderText>
      {mainText1}
      </ContentHeaderText>
      <ContentHeaderText>
      {mainText2}
      </ContentHeaderText>
      <ContentHeaderText>
      Useful links:
 &nbsp;&nbsp;<a href="https://www.canva.com/design/DAFJatuk_Vg/sXVBbx-8NFTybj3E7fa00g/view?utm_content=DAFJatuk_Vg&utm_campaign=designshare&utm_medium=link&utm_source=publishpresent" target="_blank">User Manual</a> 
      &nbsp;&nbsp;-&nbsp;&nbsp;<a href="https://bit.ly/HbuzzDC" target="_blank">Discord</a> 
      &nbsp;&nbsp;-&nbsp;&nbsp;<a href="https://twitter.com/hbuzzs" target="_blank">Twitter</a> 
      </ContentHeaderText>
      <Connect>
        <Wallet>
          <Typography theme={theme}>Let us get started</Typography>
          <Row />
          <CardContainer onClick={() => login()}>
            <Card title="Log in with Twitter" icon={<TwitterSVG />} />
          </CardContainer>
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
      
      <Loader open={showLoading} />
    </ContainerStyled>

  );
};
