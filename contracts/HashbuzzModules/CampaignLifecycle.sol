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
     * @dev Add a new campaign
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param amount The amount to be allocated to the campaign from the campaigner's balance.
     */
    function addCampaign(
        string memory campaignAddress,
        address campaigner,
        uint256 amount
    ) public onlyOwner returns (uint256) {
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(balances[campaigner] >= amount, ERR_INSUFFICIENT_BALANCE);

        balances[campaigner] -= amount;
        campaignBalances[campaignAddress] = amount;

        uint256 updatedBalance = balances[campaigner];
        emit NewCampaignIsAdded(campaignAddress, amount, HBAR);

        return updatedBalance;
    }

    /**
     * @dev Add a new campaign for fungible tokens
     * @param tokenId The address of the token in solidity format
     * @param campaignAddress The db address of the campaign [string]
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenAmount The amount of tokens to be allocated to the campaign
     */
    function addFungibleCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner,
        int64 tokenAmount
    ) public onlyOwner returns (int64) {
        require(
            isTokenWhitelisted(FUNGIBLE, tokenId),
            ERR_TOKEN_NOT_WHITELISTED
        );
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(tokenAmount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);

        uint64 amount = uint64(tokenAmount);
        require(
            tokenBalances[campaigner][tokenId][FUNGIBLE] >= amount,
            ERR_INSUFFICIENT_BALANCE
        );
        require(
            tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] == 0,
            CURRENT_BALANCE_IS_NON_ZERO
        );

        tokenBalances[campaigner][tokenId][FUNGIBLE] -= amount;
        tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] = amount;

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][FUNGIBLE];

        emit NewCampaignIsAdded(campaignAddress, amount, FUNGIBLE);
        return int64(updatedBalance);
    }

    /**
     * @dev Add a new campaign for NFT tokens
     * @param tokenId The address of the token in solidity format
     * @param campaignAddress The db address of the campaign [string]
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenAmount The amount of tokens to be allocated to the campaign
     */
    function addNFTCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner,
        int64 tokenAmount
    ) public onlyOwner returns (int64) {
        require(isTokenWhitelisted(NFT, tokenId), ERR_TOKEN_NOT_WHITELISTED);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(tokenAmount > 0, ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);

        require(
            tokenBalances[campaigner][tokenId][NFT] >= uint64(tokenAmount),
            ERR_INSUFFICIENT_BALANCE
        );
        tokenCampaignBalances[campaignAddress][tokenId][NFT] = uint64(
            tokenAmount
        );

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][NFT];

        emit NewCampaignIsAdded(campaignAddress, uint64(tokenAmount), NFT);
        return int64(updatedBalance);
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
     * @dev Close a campaign with NFT tokens
     * @param campaignAddress The db address of the campaign
     * @param campaignExpiryTime The expiry time of the campaign in seconds
     */
    function closeNFTCampaign(
        string memory campaignAddress,
        uint256 campaignExpiryTime
    ) public onlyOwner {
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(campaignExpiryTime > 0, ERR_INVALID_EXPIRY_TIME);
        require(
            !isCampaignClosed[campaignAddress][NFT],
            ERR_TCAMPAIGN_ALREADY_CLOSED
        );

        isCampaignClosed[campaignAddress][NFT] = true;
        campaignEndTime[campaignAddress][NFT] =
            block.timestamp +
            campaignExpiryTime;

        emit campaignClosed(campaignAddress, NFT);
    }

    /**
     * @dev Distribute HBAR tokens to the campaigner
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param totalAmount The total amount of tokens to be distributed
     * @param receiversAddresses The addresses of the receivers take max 50 addresses in one call
     * @param amounts The amounts to be distributed to each receiver
     */
    function rewardIntractors(
        address campaigner,
        string memory campaignAddress,
        uint256 totalAmount,
        address[] memory receiversAddresses,
        uint256[] memory amounts
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
            receiversAddresses.length == amounts.length,
            ERR_MISMATCHED_INPUT_ARRAYS
        );

        uint256 totalReward = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalReward += amounts[i];
        }

        // Ensure the total reward is not greater than the campaign balance
        require(
            totalReward <= campaignBalances[campaignAddress],
            ERR_TOTAL_REWARD_EXCEEDS_CAMPAIGN_BALANCE
        );

        // Deduct the distributed amount from the campaign's balance
        campaignBalances[campaignAddress] -= totalReward;

        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            rewardBalances[recipient] += amount;
        }

        uint256 remainingBalance = campaignBalances[campaignAddress];

        emit RewardsDistributed(campaignAddress, totalReward, remainingBalance);
        return remainingBalance;
    }

    /**
     * @dev Distribute fungible tokens to the campaigner
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param tokenTotalAmount The total amount of tokens to be distributed
     * @param tokenType The type of the token (FUNGIBLE or NFT)
     * @param receiversAddresses The addresses of the receivers take max 50 addresses in one call
     * @param amounts The amounts to be distributed to each receiver
     */
    function rewardIntractorsWithFungible(
        address tokenId,
        address campaigner,
        string memory campaignAddress,
        int64 tokenTotalAmount,
        uint32 tokenType,
        address[] memory receiversAddresses,
        uint256[] memory amounts
    ) external onlyOwner returns (uint256) {
        require(
            isTokenWhitelisted(tokenType, tokenId),
            ERR_TOKEN_NOT_WHITELISTED
        );
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
            isCampaignClosed[campaignAddress][tokenType],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            receiversAddresses.length == amounts.length,
            ERR_MISMATCHED_INPUT_ARRAYS
        );

        uint256 totalReward = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalReward += amounts[i];
        }

        // Ensure the total reward is not greater than the campaign balance
        require(
            totalReward <=
                tokenCampaignBalances[campaignAddress][tokenId][tokenType],
            ERR_TOTAL_REWARD_EXCEEDS_CAMPAIGN_BALANCE
        );

        // Deduct the distributed amount from the campaign's balance
        tokenCampaignBalances[campaignAddress][tokenId][tokenType] -= uint64(
            totalReward
        );

        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            rewardTokenBalances[recipient][tokenId][tokenType] += uint64(
                amount
            );
        }

        uint256 remainingBalance = tokenCampaignBalances[campaignAddress][
            tokenId
        ][tokenType];

        emit RewardsDistributed(campaignAddress, totalReward, remainingBalance);

        return remainingBalance;
    }

    /**
     * @dev Expiry a campaign with fungible and NFT tokens
     * @param campaignAddress The db address of the campaign
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     */
    function expiryFungibleCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner,
        uint32 tokenType
    ) public onlyOwner returns (uint64) {
        require(tokenId != address(0), ERR_INVALID_TOKEN_ADDRESS);
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        require(isCampaigner(campaigner), ERR_CAMPAIGNER_NOT_ALLOWED);
        require(
            isCampaignClosed[campaignAddress][tokenType],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            block.timestamp > campaignEndTime[campaignAddress][tokenType],
            ERR_CAMPAIGN_NOT_CLOSED
        );

        tokenBalances[campaigner][tokenId][tokenType] += tokenCampaignBalances[
            campaignAddress
        ][tokenId][tokenType];
        tokenCampaignBalances[campaignAddress][tokenId][tokenType] = 0;

        uint64 updatedBalance = tokenBalances[campaigner][tokenId][tokenType];
        emit campaignExpired(campaignAddress, tokenType);

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
            block.timestamp > campaignEndTime[campaignAddress][HBAR],
            ERR_CAMPAIGN_NOT_CLOSED
        );
        require(
            isCampaignClosed[campaignAddress][HBAR],
            ERR_CAMPAIGN_NOT_CLOSED
        );

        balances[campaigner] += campaignBalances[campaignAddress];
        campaignBalances[campaignAddress] = 0;
        uint256 updatedBalance = balances[campaigner];

        emit campaignExpired(campaignAddress, HBAR);

        return updatedBalance;
    }
}
