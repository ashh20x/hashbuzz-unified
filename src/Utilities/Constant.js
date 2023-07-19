export const NETWORK = process.env.REACT_APP_NETWORK ?? "testnet";
export const dAppApiURL = process.env.REACT_APP_DAPP_API;
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const _delete_cookie = (name) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const forceLogout = async () => {
  // await Auth.doLogout(getCookie("refreshToken"));

  localStorage.clear();
  _delete_cookie("token");
  _delete_cookie("refreshToken");
  // window.location.href("/");
};

export const forceClearStorage = () => {
  localStorage.clear();
  _delete_cookie("token");
  _delete_cookie("refreshToken");
};

export const getErrorMessage = (err) => {
  if (err?.response?.data) return err?.response?.data.error ?? err?.response?.data.message;
  if (err?.message) return err?.message;
  return "Server response error";
};
