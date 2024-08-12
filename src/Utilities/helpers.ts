import { EntityBalances, user_roles } from "../types";
export const NETWORK = process.env.REACT_APP_NETWORK ?? "testnet";
export const dAppApiURL = process.env.REACT_APP_DAPP_API;
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const COLLECTOR_ACCOUNT = process.env.REACT_APP_COLLECTOR_ACCOUNT;

export enum CampaignStatus {
  ApprovalPending = "ApprovalPending",
  CampaignApproved = "CampaignApproved",
  CampaignDeclined = "CampaignDeclined",
  CampaignStarted = "CampaignStarted",
  CampaignRunning = "CampaignRunning",
  RewardDistributionInProgress = "RewardDistributionInProgress",
  RewardsDistributed = "RewardsDistributed",
  InternalError = "InternalError",
}

export const CampaignStatusTexts = {
  [CampaignStatus.ApprovalPending]: "Approval Pending",
  [CampaignStatus.CampaignApproved]: "Campaign Approved",
  [CampaignStatus.CampaignDeclined]: "Campaign Declined",
  [CampaignStatus.CampaignStarted]: "Campaign Started",
  [CampaignStatus.CampaignRunning]: "Campaign Running",
  [CampaignStatus.RewardDistributionInProgress]: "Reward Distribution In Progress",
  [CampaignStatus.RewardsDistributed]: "Rewards Distributed",
  [CampaignStatus.InternalError]: "Internal Error",
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const _delete_cookie = (name: string) => {
//   document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// };

export const getErrorMessage = (err: any) => {
  if (err?.response?.data) return err?.response?.data?.error?.description ?? err?.response?.data.message;
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

export const isAllowedToCmapigner = (role?: user_roles): boolean => {
  if(!role) return false;
  return ["USER", "ADMIN", "SUPER_ADMIN"].includes(role);
};

export const getCardStausText = (value:CampaignStatus) =>  CampaignStatusTexts[value];

export const getCardStatusFromStatusText = (statusText: string): keyof typeof CampaignStatusTexts | undefined => {
  console.log({statusText});
  // Find the key corresponding to the given statusText
  const entry = Object.entries(CampaignStatusTexts).find(([_, text]) => text === statusText);

  // If entry is found, return the key
  if (entry) {
    return entry[0] as keyof typeof CampaignStatusTexts;
  }

  // If no matching text is found, return undefined or handle the error as needed
  return undefined;
}
