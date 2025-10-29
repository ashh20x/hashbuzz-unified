// Mirror Node API Response Types
export interface MirrorNodeToken {
  automatic_association: boolean;
  balance: number;
  created_timestamp: string;
  decimals: number;
  token_id: string;
  freeze_status: 'FROZEN' | 'UNFROZEN' | 'NOT_APPLICABLE';
  kyc_status: 'GRANTED' | 'REVOKED' | 'NOT_APPLICABLE';
}

export interface MirrorNodeTokenDetails {
  admin_key?: {
    _type: string;
    key: string;
  };
  auto_renew_account?: string | null;
  auto_renew_period?: string | null;
  created_timestamp: string;
  custom_fees: {
    created_timestamp: string;
    fixed_fees: unknown[];
    fractional_fees: unknown[];
  };
  decimals: string;
  deleted: boolean;
  expiry_timestamp: number;
  fee_schedule_key?: {
    _type: string;
    key: string;
  };
  freeze_default: boolean;
  freeze_key?: {
    _type: string;
    key: string;
  } | null;
  initial_supply: string;
  kyc_key?: {
    _type: string;
    key: string;
  } | null;
  max_supply: string;
  memo: string;
  metadata: string;
  metadata_key?: {
    _type: string;
    key: string;
  } | null;
  modified_timestamp: string;
  name: string;
  pause_key?: {
    _type: string;
    key: string;
  } | null;
  pause_status: string;
  supply_key?: {
    _type: string;
    key: string;
  } | null;
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE';
  wipe_key?: {
    _type: string;
    key: string;
  } | null;
}

export interface MirrorNodeLinks {
  next?: string;
  prev?: string;
}

export interface AccountTokensResponse {
  tokens: MirrorNodeToken[];
  links: MirrorNodeLinks;
}
