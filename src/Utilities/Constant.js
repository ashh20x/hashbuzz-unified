import { useCookies } from "react-cookie";
import { Auth } from "../APIConfig/api";

export const NETWORK = process.env.REACT_APP_NETWORK;
export const dAppApiURL = process.env.REACT_APP_DAPP_API;
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const _delete_cookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const forceLogout = async () => {
  // await Auth.doLogout(getCookie("refreshToken"));

  localStorage.clear();
  _delete_cookie("token");
  _delete_cookie("refreshToken");
  window.location.reload();
};
