// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStates.sol";
/**
 * @dev This contract is used to store the state of the Hashbuzz contract
 * @title Utils
 * @author Om Prakash
 * @notice Deals with operations related to transactions.
 */

contract Utils is HashbuzzStates {
    /**
     * @dev Adds or removes a token from the whitelist.
     * @param tokenAddress The address of the token.
     * @param isWhitelisted Boolean flag to mark the token as whitelisted or not.
     */
    function associateToken(
        address tokenAddress,
        bool isWhitelisted
    ) public onlyOwner {
        require(tokenAddress != address(0), ERR_INVALID_TOKEN_ADDRESS);
        if (isWhitelisted && !whitelistedToken[FUNGIBLE][tokenAddress]) {
            // Add to whitelist if not already whitelisted
            whitelistedToken[FUNGIBLE][tokenAddress] = true;
            whitelistedTokenAddresses[FUNGIBLE].push(tokenAddress);
        } else if (!isWhitelisted && whitelistedToken[FUNGIBLE][tokenAddress]) {
            // Remove from whitelist if currently whitelisted
            whitelistedToken[FUNGIBLE][tokenAddress] = false;

            // Remove address from whitelistedAddresses array
            uint256 length = whitelistedTokenAddresses[FUNGIBLE].length;
            for (uint256 i = 0; i < length; i++) {
                if (whitelistedTokenAddresses[FUNGIBLE][i] == tokenAddress) {
                    whitelistedTokenAddresses[FUNGIBLE][
                        i
                    ] = whitelistedTokenAddresses[FUNGIBLE][length - 1];
                    whitelistedTokenAddresses[FUNGIBLE].pop();
                    break;
                }
            }
        }
    }

    /**
     * @dev Retrieves all whitelisted addresses for a given token type.
     * @return An array of addresses that are whitelisted for the given token type.
     */
    function getAllWhitelistedTokens() public view returns (address[] memory) {
        return whitelistedTokenAddresses[FUNGIBLE];
    }

    /**
     * @dev Checks if a specific token address is whitelisted for a given token type.
     * @param tokenAddress The address of the token to check.
     * @return Boolean flag indicating if the token is whitelisted.
     */
    function isTokenWhitelisted(
        address tokenAddress
    ) public view returns (bool) {
        return whitelistedToken[FUNGIBLE][tokenAddress];
    }

    /**
     * @dev Whitelist cmapigner to the user.
     * @param newCampaigner Address of the user having campaigner role to be used here
     */
    function addCampaigner(address newCampaigner) public onlyOwner {
        require(newCampaigner != address(0), ERR_INVALID_CAMPAIGN_ADDRESS);
        require(!isCampaigner(newCampaigner), ERR_CAMPAIGN_ALREADY_EXISTS);
        campaigners[newCampaigner] = true;
        balances[newCampaigner] = 0;
        emit CampaignerAdded(newCampaigner);
    }

    /**
     * @dev Retrieves the balance of a fungible token for a specific campaigner.
     * @param campaigner Address of the campaigner's solidity address.
     * @param tokenId Solidity address used for the account.
     * @return res The balance of the fungible token.
     */
    function getFungibleTokenBalance(
        address campaigner,
        address tokenId
    ) public view returns (uint256 res) {
        require(tokenId != address(0), ERR_INVALID_TOKEN_ADDRESS);
        require(campaigner != address(0), ERR_INVALID_CAMPAIGN_ADDRESS);
        require(isTokenWhitelisted(tokenId), ERR_TOKEN_NOT_WHITELISTED);
        res = tokenBalances[campaigner][tokenId][FUNGIBLE];
    }

    /**
     * @dev Balance holded by the user to see.
     * @param campaigner Solidity address of the campaigner.
     */
    function getHbarBalance(
        address campaigner
    ) public view  returns (uint256 res) {
        res = balances[campaigner];
    }

    /** Campaign Specific balance for the campaigners */
    /**
     * @dev Balance held by the user to see.
     * @param campaignAddress Solidity address of the campaigner.
     */
    function getCampaignBalance(
        string memory campaignAddress
    ) public view returns (uint256) {
        require(
            bytes(campaignAddress).length > 0,
            ERR_INVALID_CAMPAIGN_ADDRESS
        );
        return campaignBalances[campaignAddress];
    }
}
