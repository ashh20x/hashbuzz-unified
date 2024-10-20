// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./State.sol";
import "./Utils.sol";

/**
 * @dev This contract is used to store the state of the Hashbuzz contract
 * @title Transactions
 * @author Om Prakash
 * @notice Deals with operations related to transactions.
 */
contract Transactions is State, Utils {
    function updateBalance(
        address campaigner,
        uint256 amount,
        bool deposit
    ) public onlyOwner returns (uint256) {
        require(campaigner != address(0), "Invalid campaigner address");

        if (deposit) {
            if (balances[campaigner] == 0) {
                addCampaigner(campaigner);
            }
            balances[campaigner] += amount;
            emit FundsDeposited(campaigner, amount);
        } else {
            require(
                balances[campaigner] >= amount,
                "Insufficient balance requested for withdraw"
            );
            balances[campaigner] -= amount;
            emit FundsWithdrawn(campaigner, amount);
        }

        uint256 updatedBalance = balances[campaigner];
        emit BalanceUpdated(campaigner, updatedBalance);
        return updatedBalance;
    }

    function addFungibleAmount(
        address campaigner,
        address tokenId,
        int64 tokenAmount
    ) public onlyOwner returns (int64) {
        require(msg.sender == owner, "Unauthorize Access requested");
        tokenBalances[campaigner][tokenId][FUNGIBLE] += uint64(
            int64(tokenAmount)
        );
        emit FungibleTokenDeposited(campaigner, uint64(int64(tokenAmount)));

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];
        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }

    function reimburseBalanceForFungible(
        address tokenId,
        address campaigner,
        int64 amount,
        uint32 tokenType
    ) public onlyOwner returns (int64) {
        require(msg.sender == owner, "Unauthorize Access requested");
        require(tokenType == FUNGIBLE, "Token is not fungible");
        require(
            tokenBalances[campaigner][tokenId][FUNGIBLE] >= uint64(amount),
            "Insufficient fund requested for reimburse"
        );
        tokenBalances[campaigner][tokenId][FUNGIBLE] -= uint64(amount);
        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];

        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }
}
