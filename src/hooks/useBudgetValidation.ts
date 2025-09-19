import { useGetTokenBalancesQuery } from '@/API/user';
import { TokenBalances } from '@/types';
import { useCallback } from 'react';

export interface BudgetValidationResult {
  isValid: boolean;
  errorMessage?: string;
  maxBudget: number;
  userBalance: number;
  recommendedBudget: number; // 80% of balance for safety
}

export interface UseBudgetValidationReturn {
  validateBudget: (
    budget: number,
    tokenType: 'HBAR' | 'FUNGIBLE',
    tokenId?: string
  ) => BudgetValidationResult;
  getUserBalance: (tokenType: 'HBAR' | 'FUNGIBLE', tokenId?: string) => number;
  getTokenOptions: () => Array<{
    id: string;
    name: string;
    symbol: string;
    balance: number;
    decimals: number;
  }>;
  isLoading: boolean;
}

// Minimum balance to keep for fees (in tinybars for HBAR)
const MINIMUM_HBAR_RESERVE = 5 * 100_000_000; // 5 HBAR in tinybars
const MINIMUM_TOKEN_RESERVE = 1; // 1 token unit

export const useBudgetValidation = (): UseBudgetValidationReturn => {
  const { data: tokenBalances, isLoading } = useGetTokenBalancesQuery();

  // Get user balance for a specific token type
  const getUserBalance = useCallback(
    (tokenType: 'HBAR' | 'FUNGIBLE', tokenId?: string): number => {
      if (!tokenBalances) return 0;

      if (tokenType === 'HBAR') {
        // Find HBAR balance
        const hbarToken = tokenBalances.find(
          (token: TokenBalances) =>
            token.token_id === 'HBAR' ||
            token.token_symbol === 'HBAR' ||
            token.token_id === '0.0.0'
        );
        return hbarToken?.available_balance || 0;
      } else if (tokenId) {
        // Find specific fungible token balance
        const selectedToken = tokenBalances.find(
          (token: TokenBalances) => token.token_id === tokenId
        );
        return selectedToken?.available_balance || 0;
      }

      return 0;
    },
    [tokenBalances]
  );

  // Validate budget amount
  const validateBudget = useCallback(
    (
      budget: number,
      tokenType: 'HBAR' | 'FUNGIBLE',
      tokenId?: string
    ): BudgetValidationResult => {
      const userBalance = getUserBalance(tokenType, tokenId);
      const reserve =
        tokenType === 'HBAR' ? MINIMUM_HBAR_RESERVE : MINIMUM_TOKEN_RESERVE;
      const maxBudget = Math.max(0, userBalance - reserve);
      const recommendedBudget = Math.floor(maxBudget * 0.8); // 80% of available

      // Basic validation
      if (budget <= 0) {
        return {
          isValid: false,
          errorMessage: 'Budget must be greater than 0',
          maxBudget,
          userBalance,
          recommendedBudget,
        };
      }

      // Check if user has any balance
      if (userBalance <= 0) {
        return {
          isValid: false,
          errorMessage: `You don't have any ${tokenType === 'HBAR' ? 'HBAR' : 'tokens'} available`,
          maxBudget,
          userBalance,
          recommendedBudget,
        };
      }

      // Check if budget exceeds total balance
      if (budget > userBalance) {
        return {
          isValid: false,
          errorMessage: `Budget cannot exceed your ${tokenType === 'HBAR' ? 'HBAR' : 'token'} balance: ${userBalance.toLocaleString()}`,
          maxBudget,
          userBalance,
          recommendedBudget,
        };
      }

      // Check if budget exceeds recommended maximum (leaving reserve for fees)
      if (budget > maxBudget) {
        const reserveAmount =
          tokenType === 'HBAR'
            ? `${(reserve / 100_000_000).toFixed(2)} HBAR`
            : `${reserve} tokens`;

        return {
          isValid: false,
          errorMessage: `Budget should not exceed ${maxBudget.toLocaleString()} to keep ${reserveAmount} in reserve for fees and safety`,
          maxBudget,
          userBalance,
          recommendedBudget,
        };
      }

      // Warn if budget is very high (more than 80% of available)
      if (budget > recommendedBudget) {
        return {
          isValid: true,
          errorMessage: `Consider using a lower budget (recommended: ${recommendedBudget.toLocaleString()}) to maintain a safety buffer`,
          maxBudget,
          userBalance,
          recommendedBudget,
        };
      }

      // Valid budget
      return {
        isValid: true,
        maxBudget,
        userBalance,
        recommendedBudget,
      };
    },
    [getUserBalance]
  );

  // Get available token options for dropdown
  const getTokenOptions = useCallback(() => {
    if (!tokenBalances) return [];

    return tokenBalances
      .filter((token: TokenBalances) => token.available_balance > 0)
      .map((token: TokenBalances) => ({
        id: token.token_id,
        name: token.name,
        symbol: token.token_symbol,
        balance: token.available_balance,
        decimals: token.entity_decimal || token.decimals || 0,
      }))
      .sort((a, b) => {
        // Sort HBAR first, then by balance (highest first)
        if (a.symbol === 'HBAR') return -1;
        if (b.symbol === 'HBAR') return 1;
        return b.balance - a.balance;
      });
  }, [tokenBalances]);

  return {
    validateBudget,
    getUserBalance,
    getTokenOptions,
    isLoading,
  };
};
