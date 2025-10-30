interface TokenBalance {
  token_id: string;
  balance: number;
}

interface AccountBalance {
  account: string;
  balance: number;
  tokens: TokenBalance[];
}

export interface BalanceResponse {
  timestamp: string;
  balances: AccountBalance[];
  links: {
    next: string | null;
  };
}
