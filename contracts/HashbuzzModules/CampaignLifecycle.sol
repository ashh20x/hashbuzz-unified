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
    ) public onlyOwner {
        require(!isCampaigner(campaigner), "Campaign already exists");
        require(balances[campaigner] >= amount, "Insufficient balance");

        balances[campaigner] -= amount;
        campaignBalances[campaignAddress] = amount;
        emit NewCampaignIsAdded(campaignAddress, amount, HBAR);
    }

    /**
     * @dev Add a new campaign for fungible and NFT tokens
     * @param tokenId The address of the token in solidity format
     * @param campaignAddress The db address of the campaign [string]
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenAmount The amount of tokens to be allocated to the campaign
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     */

    function addFungibleAndNFTCampaign(
        address tokenId,
        string memory campaignAddress,
        address campaigner,
        int64 tokenAmount,
        uint32 tokenType
    ) public onlyOwner {
        require(
            isTokenWhitelisted(tokenType, tokenId),
            "Hashbuzz: Token not whitelisted"
        );
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(isCampaigner(campaigner), "Campaign already exists");
        require(tokenAmount > 0, "Token amount must be greater than zero");

        if (tokenType == FUNGIBLE) {
            uint64 amount = uint64(tokenAmount);
            require(
                tokenBalances[campaigner][tokenId][FUNGIBLE] >= amount,
                "Insufficient balance"
            );
            require(
                tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] == 0,
                "Current balance is non-zero"
            );

            tokenBalances[campaigner][tokenId][FUNGIBLE] -= amount;
            tokenCampaignBalances[campaignAddress][tokenId][FUNGIBLE] = amount;

            emit NewCampaignIsAdded(campaignAddress, amount, FUNGIBLE);
        } else if (tokenType == NFT) {
            require(
                tokenBalances[campaigner][tokenId][NFT] >= uint64(tokenAmount),
                "Insufficient balance"
            );
            tokenCampaignBalances[campaignAddress][tokenId][NFT] = uint64(
                tokenAmount
            );
            emit NewCampaignIsAdded(campaignAddress, uint64(tokenAmount), NFT);
        } else {
            revert("Invalid token type");
        }
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
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(campaignExpiryTime > 0, "Invalid campaign expiry time");
        require(
            !isCampaignClosed[campaignAddress][HBAR],
            "Campaign already closed"
        );

        isCampaignClosed[campaignAddress][HBAR] = true;
        campaignEndTime[campaignAddress][HBAR] =
            block.timestamp +
            campaignExpiryTime;
        emit campaignClosed(campaignAddress, HBAR);
    }

    /**
     * @dev Close a campaign with fungible and NFT tokens
     * @param campaignAddress The db address of the campaign
     * @param campaignExpiryTime The expiry time of the campaign in seconds
     * @param tokenType The type of the token (FUNGIBLE = 1 OR  NFT = 2)
     */
    function closeFungibleAndNFTCampaign(
        string memory campaignAddress,
        uint256 campaignExpiryTime,
        uint32 tokenType
    ) public onlyOwner {
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(campaignExpiryTime > 0, "Invalid campaign expiry time");

        if (tokenType == FUNGIBLE) {
            require(
                !isCampaignClosed[campaignAddress][FUNGIBLE],
                "Campaign already closed"
            );
            isCampaignClosed[campaignAddress][FUNGIBLE] = true;
            campaignEndTime[campaignAddress][FUNGIBLE] =
                block.timestamp +
                campaignExpiryTime;
            emit campaignClosed(campaignAddress, FUNGIBLE);
        } else if (tokenType == NFT) {
            require(
                !isCampaignClosed[campaignAddress][NFT],
                "Campaign already closed"
            );
            isCampaignClosed[campaignAddress][NFT] = true;
            campaignEndTime[campaignAddress][NFT] =
                block.timestamp +
                campaignExpiryTime;
            emit campaignClosed(campaignAddress, NFT);
        } else {
            revert("Invalid token type");
        }
    }

    /**
     * @dev Distribute HBAR tokens to the campaigner
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param tokenTotalAmount The total amount of tokens to be distributed
     * @param tokenType The type of the token (FUNGIBLE or NFT)
     * @param receiversAddresses The addresses of the receivers take max 50 addresses in one call
     * @param amounts The amounts to be distributed to each receiver
     */
    function distributeFungible(
        address tokenId,
        address campaigner,
        string memory campaignAddress,
        int64 tokenTotalAmount,
        uint32 tokenType,
        address[] memory receiversAddresses,
        uint256[] memory amounts
    ) external onlyOwner {
        require(
            isTokenWhitelisted(tokenType, tokenId),
            "Token not whitelisted"
        );
        require(isCampaigner(campaigner), "Campaign already exists");
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(tokenTotalAmount > 0, "Token amount must be greater than zero");
        require(
            isCampaignClosed[campaignAddress][tokenType],
            "Campaign is not closed"
        );

        tokenCampaignBalances[campaignAddress][tokenId][tokenType] -= uint64(
            tokenTotalAmount
        );
        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            if (rewardTokenBalances[recipient][tokenId][tokenType] == 0) {
                rewardTokenBalances[recipient][tokenId][tokenType] = 0;
            }

            rewardTokenBalances[recipient][tokenId][tokenType] += uint64(
                amount
            );
        }
    }

    /**
     * @dev Distribute HBAR tokens to the campaigner
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param totalAmount The total amount of tokens to be distributed
     * @param receiversAddresses The addresses of the receivers take max 50 addresses in one call
     * @param amounts The amounts to be distributed to each receiver
     */
    function distributeBalance(
        address campaigner,
        string memory campaignAddress,
        uint256 totalAmount,
        address[] memory receiversAddresses,
        uint256[] memory amounts
    ) external onlyOwner {
        require(isCampaigner(campaigner), "Campaign already exists");
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(
            isCampaignClosed[campaignAddress][HBAR],
            "Campaign is not closed"
        );
        require(
            receiversAddresses.length == amounts.length,
            "Mismatched input arrays"
        );

        // Ensure the campaign has enough balance to distribute
        require(
            campaignBalances[campaignAddress] >= totalAmount,
            "Insufficient campaign balance to distribute amount"
        );

        // Deduct the distributed amount from the campaign's balance
        campaignBalances[campaignAddress] -= totalAmount;

        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            if (rewardBalances[recipient] == 0) {
                rewardBalances[recipient] = 0;
            }

            rewardBalances[recipient] += amount;
        }
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
    ) public onlyOwner {
        require(tokenId != address(0), "Invalid token address");
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(campaigner != address(0), "Invalid campaigner address");
        require(
            isCampaignClosed[campaignAddress][tokenType],
            "Campaign is not closed"
        );
        require(
            block.timestamp > campaignEndTime[campaignAddress][tokenType],
            "Campaign not ended"
        );

        tokenBalances[campaigner][tokenId][tokenType] += tokenCampaignBalances[
            campaignAddress
        ][tokenId][tokenType];
        tokenCampaignBalances[campaignAddress][tokenId][tokenType] = 0;
        emit campaignExpired(campaignAddress, tokenType);
    }

    /**
     * @dev Expiry a campaign with HBAR
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     */
    function expiryCampaign(
        string memory campaignAddress,
        address campaigner
    ) public onlyOwner {
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(campaigner != address(0), "Invalid campaigner address");
        require(
            block.timestamp > campaignEndTime[campaignAddress][HBAR],
            "Campaign not ended"
        );
        require(
            isCampaignClosed[campaignAddress][HBAR],
            "Campaign is not closed"
        );

        balances[campaigner] += campaignBalances[campaignAddress];
        campaignBalances[campaignAddress] = 0;
        emit campaignExpired(campaignAddress, HBAR);
    }
}
