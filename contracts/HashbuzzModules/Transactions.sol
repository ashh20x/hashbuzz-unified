// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStates.sol";
import "./Utils.sol";

/**
 * @dev This contract is used to store the state of the Hashbuzz contract
 * @title Transactions
 * @author Om Prakash
 * @notice Deals with operations related to transactions.
 */
contract Transactions is HashbuzzStates, Utils {
    /** Deposite amount to user aaccount */
    function handleDeposit(address campaigner, uint256 amount) internal {
        balances[campaigner] += amount;
        emit FundsDeposited(campaigner, amount);
    }

    /** Hnalde Withdraw from user account */
    function handleWithdrawal(address campaigner, uint256 amount) internal {
        require(balances[campaigner] >= amount, ERR_INSUFFICIENT_BALANCE);
        balances[campaigner] -= amount;
        emit FundsWithdrawn(campaigner, amount);
    }

    /**
     * @dev Topup and reimbersement cases
     * @param campaigner campaigner solidity address
     * @param amount  Amount being topuped
     * @param deposit Boolean is here
     */
    function updateBalance(
        address campaigner,
        uint256 amount,
        bool deposit
    ) public onlyOwner returns (uint256) {
        require(campaigner != address(0), ERR_INVALID_CAMPAIGN_ADDRESS);
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);

        if (deposit) {
            handleDeposit(campaigner, amount);
        } else {
            handleWithdrawal(campaigner, amount);
        }

        uint256 updatedBalance = balances[campaigner];
        emit BalanceUpdated(campaigner, updatedBalance);
        return updatedBalance;
    }

    /**
     * @dev Fungible token added to the campaigner account.
     * @param campaigner Address soliduty address
     * @param tokenId Address tokenId solidity address
     * @param tokenAmount amount added to the cmapaigner account
     */
    function addFungibleAmount(
        address campaigner,
        address tokenId,
        int64 tokenAmount
    ) public onlyOwner returns (int64) {
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        tokenBalances[campaigner][tokenId][FUNGIBLE] += uint64(
            int64(tokenAmount)
        );
        emit FungibleTokenDeposited(campaigner, uint64(int64(tokenAmount)));

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];
        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }

    /**
     * @dev This is function used for the  Reimbersing the cmapaigner balance
     * @param tokenId  Token solidity address
     * @param campaigner Campainer Address
     * @param amount  Total amount campaigner wanted to reinverse
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     */
    function reimburseBalanceForFungible(
        address tokenId,
        address campaigner,
        int64 amount,
        uint32 tokenType
    ) public onlyOwner returns (int64) {
        require(tokenType == FUNGIBLE, ERR_TOKEN_IS_NOT_FUNGIBLE);
        require(
            tokenBalances[campaigner][tokenId][FUNGIBLE] >= uint64(amount),
            ERR_INSUFFICIENT_BALANCE
        );
        tokenBalances[campaigner][tokenId][FUNGIBLE] -= uint64(amount);
        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];

        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }
}
