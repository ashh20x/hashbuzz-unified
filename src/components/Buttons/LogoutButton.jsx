import React from "react";
import PrimaryButton from "./PrimaryButton";
import { LinkContainer } from "../Pages/CreateCard/CreateTwitterPage.styles";
import { useCookies } from "react-cookie";
import { useDappAPICall } from "../../APIConfig/dAppApiServices";
import { useNavigate } from "react-router-dom";
export const LogoutButton = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "refreshToken"]);
  const { dAppAuthAPICall } = useDappAPICall();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try{
    const token = cookies.refreshToken;
    await dAppAuthAPICall({
      url: "logout",
      method: "POST",
      data: {
        refreshToken: token
      },
    });
    removeCookie("refreshToken");
    localStorage.clear();
    removeCookie("token");
    navigate("/")
  }catch(err){
    removeCookie("refreshToken");
    localStorage.clear();
    removeCookie("token");
    navigate("/")

  }
  };
  return (
    <LinkContainer>
      <PrimaryButton
        text="Log Out"
        inverse={true}
        onclick={handleLogOut}
        colors="#EF5A22"
        border="0px solid #EF5A22"
        width="100px"
        height="50px"
        margin="0px 50px 15px 0px"
      />
    </LinkContainer>
  );
};
