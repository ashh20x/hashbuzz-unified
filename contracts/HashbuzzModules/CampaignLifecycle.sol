// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStates.sol";
import "./Utils.sol";

/**
 * @title CampaignLifecycle
 * @dev This contract manages the campaign's lifecycle calls and state changes.
 */
contract Lifecycle is HashbuzzStates, Utils {
    /**
     * @dev Add a new campaign or top up an existing campaign
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param amount The amount to be allocated to the campaign from the campaigner's balance.
     */
    function addCampaignOrTopUp(
        string memory campaignAddress,
        address campaigner,
        uint256 amount
    ) public onlyOwner returns (uint256) {
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(balances[campaigner] >= amount, ERR_INSUFFICIENT_BALANCE);

        balances[campaigner] -= amount;
        campaignBalances[campaignAddress] += amount;

        uint256 updatedBalance = balances[campaigner];

        if (campaignBalances[campaignAddress] == amount) {
            emit NewCampaignIsAdded(campaignAddress, amount, HBAR);
        } else {
            emit CampaignToppedUp(campaignAddress, amount, HBAR);
        }

        return updatedBalance;
    }

    /**
     * @dev Add a new campaign for fungible tokens or top up an existing campaign
     * @param tokenId The address of the token in solidity format
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenAmount The amount of tokens to be allocated to the campaign
     */
    function addFungibleCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner,
        uint64 tokenAmount
    ) public onlyOwner returns (uint64) {
        require(isTokenWhitelisted(tokenId), ERR_TOKEN_NOT_WHITELISTED);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(tokenAmount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);

        uint64 amount = tokenAmount;
        require(
            tokenBalances[campaigner][tokenId][FUNGIBLE] >= amount,
            ERR_INSUFFICIENT_BALANCE
        );

        tokenBalances[campaigner][tokenId][FUNGIBLE] -= amount;
        tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] += amount;

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];

        if (
            tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] == amount
        ) {
            emit NewCampaignIsAdded(campaignAddress, amount, FUNGIBLE);
        } else {
            emit CampaignToppedUp(campaignAddress, amount, FUNGIBLE);
        }

        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return updatedBalance;
    }

    /**
     * @dev Close a campaign with HBAR
     * @param campaignAddress The db address of the campaign
     * @param campaignExpiryTime The expiry time of the campaign in seconds
     */
    function closeCampaign(
        string memory campaignAddress,
        uint256 campaignExpiryTime
    ) public onlyOwner {
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(campaignExpiryTime > 0, ERR_INVALID_EXPIRY_TIME);
        require(
            !isCampaignClosed[campaignAddress][HBAR],
            ERR_TCAMPAIGN_ALREADY_CLOSED
        );

        isCampaignClosed[campaignAddress][HBAR] = true;
        campaignEndTime[campaignAddress][HBAR] =
            block.timestamp +
            campaignExpiryTime;
        emit campaignClosed(campaignAddress, HBAR);
    }

    /**
     * @dev Close a campaign with fungible tokens
     * @param campaignAddress The db address of the campaign
     * @param campaignExpiryTime The expiry time of the campaign in seconds
     */
    function closeFungibleCampaign(
        string memory campaignAddress,
        uint256 campaignExpiryTime
    ) public onlyOwner {
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(campaignExpiryTime > 0, ERR_INVALID_EXPIRY_TIME);
        require(
            !isCampaignClosed[campaignAddress][FUNGIBLE],
            ERR_TCAMPAIGN_ALREADY_CLOSED
        );

        isCampaignClosed[campaignAddress][FUNGIBLE] = true;
        campaignEndTime[campaignAddress][FUNGIBLE] =
            block.timestamp +
            campaignExpiryTime;

        emit campaignClosed(campaignAddress, FUNGIBLE);
    }

    /**
     * @dev Distribute HBAR tokens to the campaigner
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param totalAmount The total amount of tokens to be distributed
     */
    function adjustTotalReward(
        address campaigner,
        string memory campaignAddress,
        uint256 totalAmount
    ) external onlyOwner returns (uint256) {
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(totalAmount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
        require(
            isCampaignClosed[campaignAddress][HBAR],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            campaignBalances[campaignAddress] >= totalAmount,
            "Insufficient campaign balance"
        );

        // Deduct the distributed amount from the campaign's balance
        campaignBalances[campaignAddress] -= totalAmount;
        uint256 remainingBalance = campaignBalances[campaignAddress];

        emit RewardsDistributed(campaignAddress, totalAmount, remainingBalance);
        return remainingBalance;
    }
    /**
     * @dev Distribute fungible tokens to the campaigner
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param tokenTotalAmount The total amount of tokens to be distributed
     */
    function adjustTotalFungibleReward(
        address tokenId,
        address campaigner,
        string memory campaignAddress,
        uint64 tokenTotalAmount
    ) external onlyOwner returns (uint256) {
        require(isTokenWhitelisted(tokenId), ERR_TOKEN_NOT_WHITELISTED);
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(
            tokenTotalAmount > 0,
            ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO
        );
        require(
            isCampaignClosed[campaignAddress][FUNGIBLE],
            ERR_CAMPAIGN_NOT_CLOSED
        );

        // Deduct the distributed amount from the campaign's balance
        tokenCampaignBalances[campaignAddress][tokenId][
            FUNGIBLE
        ] -= tokenTotalAmount;
        uint64 remainingBalance = tokenCampaignBalances[campaignAddress][
            tokenId
        ][FUNGIBLE];

        emit RewardsDistributed(
            campaignAddress,
            uint256(tokenTotalAmount),
            remainingBalance
        );

        return uint256(remainingBalance);
    }

    /**
     * @dev Expiry a campaign with fungible tokens campaigners only
     * @param campaignAddress The db address of the campaign
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     */
    function expiryFungibleCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner
    ) public onlyOwner returns (uint64) {
        require(tokenId != address(0), ERR_INVALID_TOKEN_ADDRESS);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(
            isCampaignClosed[campaignAddress][FUNGIBLE],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            block.timestamp > campaignEndTime[campaignAddress][FUNGIBLE],
            ERR_CAMPAIGN_EXPIRY_TIME_NOT_PASSED
        );

        tokenBalances[campaigner][tokenId][FUNGIBLE] += tokenCampaignBalances[
            campaignAddress
        ][tokenId][FUNGIBLE];
        tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] = 0;

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];
        emit campaignExpired(campaignAddress, FUNGIBLE);

        return updatedBalance;
    }

    /**
     * @dev Expiry a campaign with HBAR
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     */
    function expiryCampaign(
        string memory campaignAddress,
        address campaigner
    ) public onlyOwner returns (uint256) {
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);

        require(
            isCampaignClosed[campaignAddress][HBAR],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            block.timestamp > campaignEndTime[campaignAddress][HBAR],
            ERR_CAMPAIGN_EXPIRY_TIME_NOT_PASSED
        );

        balances[campaigner] += campaignBalances[campaignAddress];
        campaignBalances[campaignAddress] = 0;
        uint256 updatedBalance = balances[campaigner];

        emit campaignExpired(campaignAddress, HBAR);

        return updatedBalance;
    }
}
