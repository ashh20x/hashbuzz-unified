// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStates.sol";
contract Utils is HashbuzzStates {
    /**
     * @dev Adds or removes a token from the whitelist.
     * @param tokenAddress The address of the token.
     * @param tokenType The type of the token (1 for FUNGIBLE, 2 for NFT).
     * @param isWhitelisted Boolean flag to mark the token as whitelisted or not.
     */
    function associateToken(
        address tokenAddress,
        uint32 tokenType,
        bool isWhitelisted
    ) public onlyOwner {
        require(
            tokenType == FUNGIBLE || tokenType == NFT,
            "Invalid token type"
        );

        if (isWhitelisted && !whitelistedToken[tokenType][tokenAddress]) {
            // Add to whitelist if not already whitelisted
            whitelistedToken[tokenType][tokenAddress] = true;
            whitelistedAddresses[tokenType].push(tokenAddress);
        } else if (
            !isWhitelisted && whitelistedToken[tokenType][tokenAddress]
        ) {
            // Remove from whitelist if currently whitelisted
            whitelistedToken[tokenType][tokenAddress] = false;

            // Remove address from whitelistedAddresses array
            uint256 length = whitelistedAddresses[tokenType].length;
            for (uint256 i = 0; i < length; i++) {
                if (whitelistedAddresses[tokenType][i] == tokenAddress) {
                    whitelistedAddresses[tokenType][i] = whitelistedAddresses[
                        tokenType
                    ][length - 1];
                    whitelistedAddresses[tokenType].pop();
                    break;
                }
            }
        }
    }

    /**
     * @dev Retrieves all whitelisted addresses for a given token type.
     * @param tokenType The type of the token (1 for FUNGIBLE, 2 for NFT).
     * @return An array of addresses that are whitelisted for the given token type.
     */
    function getAllWhitelistedTokens(
        uint32 tokenType
    ) public view returns (address[] memory) {
        require(
            tokenType == FUNGIBLE || tokenType == NFT,
            "Invalid token type"
        );
        return whitelistedAddresses[tokenType];
    }

    /**
     * @dev Checks if a specific token address is whitelisted for a given token type.
     * @param tokenType The type of the token (1 for FUNGIBLE, 2 for NFT).
     * @param tokenAddress The address of the token to check.
     * @return Boolean flag indicating if the token is whitelisted.
     */
    function isTokenWhitelisted(
        uint32 tokenType,
        address tokenAddress
    ) public view returns (bool) {
        return whitelistedToken[tokenType][tokenAddress];
    }

    /**
     * @dev Whitelist cmapigner to the user.
     * @param newCampaigner Address of the user having campaigner role to be used here
     */
    function addCampaigner(address newCampaigner) public onlyOwner {
        require(newCampaigner != address(0), "Invalid campaigner address");
        require(isCampaigner(newCampaigner), "Campaigner already exists");
        campaigners[newCampaigner] = true;
        balances[newCampaigner] = 0;
        emit CampaignerAdded(newCampaigner);
    }

    /**
     *
     * @param campaigner Address of the campaigner'solidity address
     * @param tokenId Solidity address used for the account
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     */
    function getFungibleTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view onlyOwnerOrCampaigner returns (uint64 res) {
        // tokentype should be fungible
        require(tokenType == FUNGIBLE, "Token is not fungible");
        // required token to be associated
        require(
            isTokenWhitelisted(FUNGIBLE, tokenId),
            "Requested token is not whitelisted"
        );
        res = tokenBalances[campaigner][tokenId][FUNGIBLE];
    }

    /** Balance Query functions only callable by campaigner it self and no others else */
    /**
     * @dev Balance holded by the user to see.
     * @param campaigner Solidity address of the campaigner.
     * @param tokenId Solidity address of the token.
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     *                  1 for FUNGIBLE and 2 for NFT.
     */
    function getNFTTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view onlyOwnerOrCampaigner returns (uint64 res) {
        require(tokenType == NFT, "Token is not NFT");
        res = tokenBalances[campaigner][tokenId][NFT];
    }

    /** Campaign Specific balance for the cmapigners */
    /**
     * @dev Balance holded by the user to see.
     * @param campaignAddress Solidity address of the campaigner.
     */
    function getCampaignBalance(
        string memory campaignAddress
    ) public view onlyOwnerOrCampaigner returns (uint256) {
        return campaignBalances[campaignAddress];
    }
}
