export interface TokenInfo {
  admin_key: {
    _type: string;
    key: string;
  };
  auto_renew_account: null | string;
  auto_renew_period: null | string;
  created_timestamp: string;
  custom_fees: {
    created_timestamp: string;
    fixed_fees: any[];
    fractional_fees: any[];
  };
  decimals: string;
  deleted: boolean;
  expiry_timestamp: string;
  fee_schedule_key: {
    _type: string;
    key: string;
  };
  freeze_default: boolean;
  freeze_key: null | string;
  initial_supply: string;
  kyc_key: null | string;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key: {
    _type: string;
    key: string;
  };
  pause_status: string;
  supply_key: {
    _type: string;
    key: string;
  };
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
  wipe_key: null | string;
}

export type AllTokensQuery = {
  message?: string;
  data: {
    added_by: number;
    created_at: string;
    id: number;
    token_id: string;
    token_type: string;
    tokendata: TokenInfo;
  }[];
};
