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
        require(amount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
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
     * @param campaigner Address of the campaigner
     * @param tokenId Token ID address
     * @param tokenAmount Amount added to the campaigner account
     */
    function addFungibleAmount(
        address campaigner,
        address tokenId,
        uint256 tokenAmount
    ) public onlyOwner returns (uint256) {
        require(campaigner != address(0), ERR_INVALID_CAMPAIGN_ADDRESS);
        require(tokenId != address(0), ERR_INVALID_TOKEN_ADDRESS);
        require(tokenAmount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(isTokenWhitelisted(tokenId), ERR_TOKEN_NOT_WHITELISTED);
        tokenBalances[campaigner][tokenId][FUNGIBLE] += tokenAmount;
        emit FungibleTokenDeposited(campaigner, tokenAmount);

        uint256 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];
        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return updatedBalance;
    }

    /**
     * @dev This function is used for reimbursing the campaigner balance
     * @param tokenId  Token solidity address
     * @param campaigner Campaigner Address
     * @param amount  Total amount campaigner wanted to reimburse
     */
    function reimburseBalanceForFungible(
        address tokenId,
        address campaigner,
        uint256 amount
    ) public onlyOwner returns (uint256) {
        require(campaigner != address(0), ERR_INVALID_CAMPAIGN_ADDRESS);
        require(tokenId != address(0), ERR_INVALID_TOKEN_ADDRESS);
        require(amount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(isTokenWhitelisted(tokenId), ERR_TOKEN_NOT_WHITELISTED);
        require(
            tokenBalances[campaigner][tokenId][FUNGIBLE] >= amount,
            ERR_INSUFFICIENT_BALANCE
        );

        tokenBalances[campaigner][tokenId][FUNGIBLE] -= amount;
        uint256 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];

        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return updatedBalance;
    }
}
