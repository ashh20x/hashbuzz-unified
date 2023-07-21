export const NETWORK = process.env.REACT_APP_NETWORK ?? "testnet";
export const dAppApiURL = process.env.REACT_APP_DAPP_API;
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const _delete_cookie = (name: string) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const getErrorMessage = (err: any) => {
  if (err?.response?.data) return err?.response?.data.error ?? err?.response?.data.message;
  if (err?.message) return err?.message;
  return "Server response error";
};
