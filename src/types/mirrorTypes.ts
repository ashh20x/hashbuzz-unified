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

export interface MirrorNodeLinks {
  next?: string;
  prev?: string;
}

export interface AccountTokensResponse {
  tokens: MirrorNodeToken[];
  links: MirrorNodeLinks;
}
