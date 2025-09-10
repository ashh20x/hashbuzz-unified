import { EntityBalances, user_roles } from '../types';
export const NETWORK = import.meta.env.VITE_NETWORK ?? 'testnet';
export const dAppApiURL = import.meta.env.VITE_DAPP_API;

export enum CampaignStatus {
  ApprovalPending = 'ApprovalPending',
  CampaignApproved = 'CampaignApproved',
  CampaignDeclined = 'CampaignDeclined',
  CampaignStarted = 'CampaignStarted',
  CampaignRunning = 'CampaignRunning',
  RewardDistributionInProgress = 'RewardDistributionInProgress',
  RewardsDistributed = 'RewardsDistributed',
  InternalError = 'InternalError',
}

export const CampaignStatusTexts = {
  [CampaignStatus.ApprovalPending]: 'Approval Pending',
  [CampaignStatus.CampaignApproved]: 'Campaign Approved',
  [CampaignStatus.CampaignDeclined]: 'Campaign Declined',
  [CampaignStatus.CampaignStarted]: 'Campaign Started',
  [CampaignStatus.CampaignRunning]: 'Campaign Running',
  [CampaignStatus.RewardDistributionInProgress]:
    'Reward Distribution In Progress',
  [CampaignStatus.RewardsDistributed]: 'Rewards Distributed',
  [CampaignStatus.InternalError]: 'Internal Error',
};

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getErrorMessage = (err: any) => {
  if (err?.response?.data)
    return (
      err?.response?.data?.error?.description ?? err?.response?.data.message
    );
  if (err?.message) return err?.message;
  return 'Server response error';
};

export const isAnyBalancesIsAvailable = (
  entities: EntityBalances[]
): boolean => {
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
  if (!role) return false;
  return ['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role);
};

export const getCardStausText = (value: CampaignStatus) =>
  CampaignStatusTexts[value];

export const getCardStatusFromStatusText = (
  statusText: string
): keyof typeof CampaignStatusTexts | undefined => {
  console.log({ statusText });
  // Find the key corresponding to the given statusText
  const entry = Object.entries(CampaignStatusTexts).find(
    ([_, text]) => text === statusText
  );

  // If entry is found, return the key
  if (entry) {
    return entry[0] as keyof typeof CampaignStatusTexts;
  }

  // If no matching text is found, return undefined or handle the error as needed
  return undefined;
};

export const getSymbol = (entities: EntityBalances[], entityId: string) => {
  const icon = entities.find(
    entity => entity.entityId === entityId
  )?.entityIcon;
  return icon;
};

export const getCookieByName = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const getCookie = (cname: string) => {
  let name = cname + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};
