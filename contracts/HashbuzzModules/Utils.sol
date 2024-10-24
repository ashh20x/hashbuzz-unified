// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStates.sol";
contract Utils is HashbuzzStates {
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
     * @param sender Oly owner will be sender of this function.
     * @param tokenAddress  Solidty address of the campaigner.
     * @param tokenType The type of the token (FUNGIBLE or NFT) [uint32] (1 for FUNGIBLE & 2 for NFT)
     */
    function associateToken(
        address sender,
        address tokenAddress,
        uint32 tokenType
    ) public onlyOwner {
        if (tokenType == FUNGIBLE) {
            associateCampainer[sender][tokenAddress][FUNGIBLE] = true;
        } else if (tokenType == NFT) {
            associateCampainer[sender][tokenAddress][NFT] = true;
        } else {
            revert("Invalid token type");
        }
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
            associateCampainer[campaigner][tokenId][FUNGIBLE],
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
