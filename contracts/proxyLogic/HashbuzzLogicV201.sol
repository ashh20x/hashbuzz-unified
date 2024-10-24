// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzState201.sol";
contract HashbuzzLogicV201 {
    HashbuzzState201 public stateContract;

    constructor(address _stateContract) {
        require(_stateContract != address(0), "Invalid state contract address");
        stateContract = HashbuzzState201(_stateContract);
    }

    receive() external payable {}
    fallback() external payable {}

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Unauthorize Access requested, Caller is not the owner"
        );
        _;
    }

    modifier onlyOwnerOrCampaigner() {
        require(
            msg.sender == owner || isCampaigner(msg.sender),
            "Unauthorize Access requested, Caller must be owner or campaigner."
        );
        _;
    }

    /**
     * @dev check capaigner is permiited
     * @param _address  address of the campaigner
     */
    function isCampaigner(address _address) internal view returns (bool) {
        return campaigners[_address];
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

    // Transactions

    /** Deposite amount to user aaccount */
    function handleDeposit(address campaigner, uint256 amount) internal {
        if (balances[campaigner] == 0) {
            addCampaigner(campaigner);
        }
        balances[campaigner] += amount;
        emit FundsDeposited(campaigner, amount);
    }

    /** Hnalde Withdraw from user account */
    function handleWithdrawal(address campaigner, uint256 amount) internal {
        require(
            balances[campaigner] >= amount,
            "Insufficient balance requested for withdraw"
        );
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
        require(campaigner != address(0), "Invalid campaigner address");
        require(isCampaigner(campaigner), "Campaigner is not listed");

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
        require(isCampaigner(campaigner), "Campaigner is not listed.");
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

    // Lifecycle

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
        require(isCampaigner(campaigner), "Campaign already exists");
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
        require(tokenId != address(0), "Invalid token address");
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
        require(tokenId != address(0), "Invalid token address");
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
