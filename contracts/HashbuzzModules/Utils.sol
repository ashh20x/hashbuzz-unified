// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./State.sol";
contract Utils is State {
    function getFungibleTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view returns (uint64 res) {
        require(tokenType == FUNGIBLE, "Token is not fungible");
        res = tokenBalances[campaigner][tokenId][FUNGIBLE];
    }

    function getNFTTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view returns (uint64 res) {
        require(tokenType == NFT, "Token is not NFT");
        res = tokenBalances[campaigner][tokenId][NFT];
    }

    function getCampaignBalance(
        string memory campaignAddress
    ) public view returns (uint256) {
        return campaignBalances[campaignAddress];
    }

    function associateToken(
        address sender,
        address tokenAddress,
        uint32 tokenType
    ) external onlyOwner {
        if (tokenType == FUNGIBLE) {
            associateCampainer[sender][tokenAddress][FUNGIBLE] = true;
        } else if (tokenType == NFT) {
            associateCampainer[sender][tokenAddress][NFT] = true;
        } else {
            revert("Invalid token type");
        }
    }

    function addCampaigner(address newCampaigner) public onlyOwner {
        require(newCampaigner != address(0), "Invalid campaigner address");
        require(balances[newCampaigner] == 0, "Campaigner already exists");
        balances[newCampaigner] = 0;
        emit CampaignerAdded(newCampaigner);
    }
}
