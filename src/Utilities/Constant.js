export const NETWORK = process.env.REACT_APP_NETWORK;
export const dAppApiURL = process.env.REACT_APP_DAPP_API;

export const delay = ms => new Promise(res => setTimeout(res, ms));


export const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}