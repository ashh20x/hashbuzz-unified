import { EntityBalances } from "../types";
export const NETWORK = process.env.REACT_APP_NETWORK ?? "testnet";
export const dAppApiURL = process.env.REACT_APP_DAPP_API;
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const COLLECTOR_ACCOUNT = process.env.REACT_APP_COLLECTOR_ACCOUNT

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const _delete_cookie = (name: string) => {
//   document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// };

export const getErrorMessage = (err: any) => {
  if (err?.response?.data) return err?.response?.data?.error?.description  ?? err?.response?.data.message;
  if (err?.message) return err?.message;
  return "Server response error";
};

export const isAnyBalancesIsAvailable = (entities: EntityBalances[]): boolean => {
  let isAvailable = false;
  for (let i = 0; i < entities.length; i++) {
    const element = entities[i];
    if (parseFloat(element.entityBalance) > 0) {
      isAvailable = true;
      break;
    }
  }
  return isAvailable;
};
