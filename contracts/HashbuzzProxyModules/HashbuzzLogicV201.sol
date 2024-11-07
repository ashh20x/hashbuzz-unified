// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzStateV201.sol";

contract HashbuzzLogicV201 {
    HashbuzzStateV201 public stateContract;

    event CampaignerDeleted(address campaigner);
    event CampaignerAdded(address campaigner);
    event FundsDeposited(address campaigner, uint256 amount);
    event FundsWithdrawn(address campaigner, uint256 amount);
    event CampaignClosed(string campaignAddress, uint32 campaignType);
    event CampaignExpired(string campaignAddress, uint32 campaignType);
    event InteractorPaid(
        address interactor,
        address campaigner,
        uint256 amount
    );
    event InteractorPaidDeferred(string campaignAddress, uint256 amount);
    event NewCampaignIsAdded(
        string campaignAddress,
        uint256 amount,
        uint32 campaignType
    );
    event ResponseCode(int responseCode);
    event CreatedToken(address tokenAddress);
    event FungibleTokenDeposited(address campaigner, uint64 amount);
    event BalanceUpdated(address campaigner, uint256 updatedBalance);
    event FungibleTokenBalanceUpdated(
        address campaigner,
        address tokenId,
        uint64 updatedBalance
    );

    constructor(address _stateContract) {
        require(_stateContract != address(0), "Invalid state contract address");
        stateContract = HashbuzzStateV201(_stateContract);
    }

    receive() external payable {}
    fallback() external payable {}

    modifier onlyOwner() {
        require(
            msg.sender == stateContract.owner(),
            "Unauthorized: Not the owner"
        );
        _;
    }

    modifier onlyOwnerOrCampaigner() {
        require(
            msg.sender == stateContract.owner() ||
                stateContract.isCampaigner(msg.sender),
            "Unauthorized: Not the owner or campaigner"
        );
        _;
    }

    /**
     * @dev Check if an address is a campaigner
     * @param _address Address of the campaigner
     */
    function isCampaigner(address _address) internal view returns (bool) {
        return stateContract.isCampaigner(_address);
    }

    // Utility functions

    /**
     * @dev Whitelist campaigner
     * @param newCampaigner Address of the user having campaigner role
     */
    function addCampaigner(address newCampaigner) public onlyOwner {
        require(newCampaigner != address(0), "Invalid campaigner address");
        require(!isCampaigner(newCampaigner), "Campaigner already exists");
        stateContract.addCampaigner(newCampaigner);
        stateContract.setBalance(newCampaigner, 0);
    }

    /**
     * @dev Associate token with a campaigner
     * @param sender Address of the sender
     * @param tokenAddress Address of the token
     * @param tokenType Type of the token (FUNGIBLE or NFT)
     */
    function associateToken(
        address sender,
        address tokenAddress,
        uint32 tokenType
    ) public onlyOwner {
        if (tokenType == stateContract.FUNGIBLE()) {
            stateContract.setAssociateCampaigner(
                sender,
                tokenAddress,
                stateContract.FUNGIBLE(),
                true
            );
        } else if (tokenType == stateContract.NFT()) {
            stateContract.setAssociateCampaigner(
                sender,
                tokenAddress,
                stateContract.NFT(),
                true
            );
        } else {
            revert("Invalid token type");
        }
    }

    /**
     * @dev Get fungible token balance
     * @param campaigner Address of the campaigner
     * @param tokenId Address of the token
     * @param tokenType Type of the token (FUNGIBLE)
     */
    function getFungibleTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view onlyOwnerOrCampaigner returns (uint64 res) {
        require(tokenType == stateContract.FUNGIBLE(), "Token is not fungible");
        require(
            stateContract.isAssociateCampaigner(
                campaigner,
                tokenId,
                stateContract.FUNGIBLE()
            ),
            "Requested token is not whitelisted"
        );
        res = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE()
        );
    }

    /**
     * @dev Get NFT token balance
     * @param campaigner Address of the campaigner
     * @param tokenId Address of the token
     * @param tokenType Type of the token (NFT)
     */
    function getNFTTokenBalance(
        address campaigner,
        address tokenId,
        uint32 tokenType
    ) public view onlyOwnerOrCampaigner returns (uint64 res) {
        require(tokenType == stateContract.NFT(), "Token is not NFT");
        res = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.NFT()
        );
    }

    /**
     * @dev Get campaign balance
     * @param campaignAddress Address of the campaign
     */
    function getCampaignBalance(
        string memory campaignAddress
    ) public view onlyOwnerOrCampaigner returns (uint256) {
        return stateContract.getCampaignBalance(campaignAddress);
    }

    // Transaction and interaction functions

    /**
     * @dev Handle deposit to user account
     * @param campaigner Address of the campaigner
     * @param amount Amount to be deposited
     */
    function handleDeposit(address campaigner, uint256 amount) internal {
        if (stateContract.getBalance(campaigner) == 0) {
            addCampaigner(campaigner);
        }
        uint256 newBalance = stateContract.getBalance(campaigner) + amount;
        stateContract.setBalance(campaigner, newBalance);
        emit FundsDeposited(campaigner, amount);
    }

    /**
     * @dev Handle withdrawal from user account
     * @param campaigner Address of the campaigner
     * @param amount Amount to be withdrawn
     */
    function handleWithdrawal(address campaigner, uint256 amount) internal {
        require(
            stateContract.getBalance(campaigner) >= amount,
            "Insufficient balance requested for withdraw"
        );
        uint256 newBalance = stateContract.getBalance(campaigner) - amount;
        stateContract.setBalance(campaigner, newBalance);
        emit FundsWithdrawn(campaigner, amount);
    }

    /**
     * @dev Update balance (deposit or withdraw)
     * @param campaigner Address of the campaigner
     * @param amount Amount to be updated
     * @param deposit Boolean indicating deposit or withdrawal
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

        uint256 updatedBalance = stateContract.getBalance(campaigner);
        emit BalanceUpdated(campaigner, updatedBalance);
        return updatedBalance;
    }

    /**
     * @dev Add fungible amount to campaigner account
     * @param campaigner Address of the campaigner
     * @param tokenId Address of the token
     * @param tokenAmount Amount to be added
     */
    function addFungibleAmount(
        address campaigner,
        address tokenId,
        int64 tokenAmount
    ) public onlyOwner returns (int64) {
        require(isCampaigner(campaigner), "Campaigner is not listed.");
        uint64 newAmount = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE()
        ) + uint64(tokenAmount);
        stateContract.setTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE(),
            newAmount
        );
        emit FungibleTokenDeposited(campaigner, uint64(tokenAmount));

        uint64 updatedBalance = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE()
        );
        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }

    /**
     * @dev Reimburse balance for fungible tokens
     * @param tokenId Address of the token
     * @param campaigner Address of the campaigner
     * @param amount Amount to be reimbursed
     * @param tokenType Type of the token (FUNGIBLE)
     */
    function reimburseBalanceForFungible(
        address tokenId,
        address campaigner,
        int64 amount,
        uint32 tokenType
    ) public onlyOwner returns (int64) {
        require(tokenType == stateContract.FUNGIBLE(), "Token is not fungible");
        require(
            stateContract.getTokenBalance(
                campaigner,
                tokenId,
                stateContract.FUNGIBLE()
            ) >= uint64(amount),
            "Insufficient fund requested for reimburse"
        );
        uint64 newAmount = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE()
        ) - uint64(amount);
        stateContract.setTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE(),
            newAmount
        );
        uint64 updatedBalance = stateContract.getTokenBalance(
            campaigner,
            tokenId,
            stateContract.FUNGIBLE()
        );

        emit FungibleTokenBalanceUpdated(campaigner, tokenId, updatedBalance);
        return int64(updatedBalance);
    }

    // Campaign Lifecycle functions

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
        require(
            stateContract.getBalance(campaigner) >= amount,
            "Insufficient balance"
        );

        uint256 newBalance = stateContract.getBalance(campaigner) - amount;
        stateContract.setBalance(campaigner, newBalance);
        stateContract.setCampaignBalance(campaignAddress, amount);
        emit NewCampaignIsAdded(campaignAddress, amount, stateContract.HBAR());
    }

    /**
     * @dev Add a new campaign for fungible and NFT tokens
     * @param tokenId The address of the token in solidity format
     * @param campaignAddress The db address of the campaign
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param tokenAmount The amount of tokens to be allocated to the campaign
     * @param tokenType The type of the token (FUNGIBLE or NFT)
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

        if (tokenType == stateContract.FUNGIBLE()) {
            uint64 amount = uint64(tokenAmount);
            require(
                stateContract.getTokenBalance(
                    campaigner,
                    tokenId,
                    stateContract.FUNGIBLE()
                ) >= amount,
                "Insufficient balance"
            );
            require(
                stateContract.getTokenCampaignBalance(
                    campaignAddress,
                    tokenId,
                    stateContract.FUNGIBLE()
                ) == 0,
                "Current balance is non-zero"
            );

            uint64 newBalance = stateContract.getTokenBalance(
                campaigner,
                tokenId,
                stateContract.FUNGIBLE()
            ) - amount;
            stateContract.setTokenBalance(
                campaigner,
                tokenId,
                stateContract.FUNGIBLE(),
                newBalance
            );
            stateContract.setTokenCampaignBalance(
                campaignAddress,
                tokenId,
                stateContract.FUNGIBLE(),
                amount
            );

            emit NewCampaignIsAdded(
                campaignAddress,
                amount,
                stateContract.FUNGIBLE()
            );
        } else if (tokenType == stateContract.NFT()) {
            require(
                stateContract.getTokenBalance(
                    campaigner,
                    tokenId,
                    stateContract.NFT()
                ) >= uint64(tokenAmount),
                "Insufficient balance"
            );
            stateContract.setTokenCampaignBalance(
                campaignAddress,
                tokenId,
                stateContract.NFT(),
                uint64(tokenAmount)
            );
            emit NewCampaignIsAdded(
                campaignAddress,
                uint64(tokenAmount),
                stateContract.NFT()
            );
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
            !stateContract.getIsCampaignClosed(
                campaignAddress,
                stateContract.HBAR()
            ),
            "Campaign already closed"
        );

        stateContract.setIsCampaignClosed(
            campaignAddress,
            stateContract.HBAR(),
            true
        );
        stateContract.setCampaignEndTime(
            campaignAddress,
            stateContract.HBAR(),
            block.timestamp + campaignExpiryTime
        );
        emit CampaignClosed(campaignAddress, stateContract.HBAR());
    }

    /**
     * @dev Close a campaign with fungible and NFT tokens
     * @param campaignAddress The db address of the campaign
     * @param campaignExpiryTime The expiry time of the campaign in seconds
     * @param tokenType The type of the token (FUNGIBLE or NFT)
     */
    function closeFungibleAndNFTCampaign(
        string memory campaignAddress,
        uint256 campaignExpiryTime,
        uint32 tokenType
    ) public onlyOwner {
        require(bytes(campaignAddress).length > 0, "Invalid campaign address");
        require(campaignExpiryTime > 0, "Invalid campaign expiry time");

        if (tokenType == stateContract.FUNGIBLE()) {
            require(
                !stateContract.getIsCampaignClosed(
                    campaignAddress,
                    stateContract.FUNGIBLE()
                ),
                "Campaign already closed"
            );
            stateContract.setIsCampaignClosed(
                campaignAddress,
                stateContract.FUNGIBLE(),
                true
            );
            stateContract.setCampaignEndTime(
                campaignAddress,
                stateContract.FUNGIBLE(),
                block.timestamp + campaignExpiryTime
            );
            emit CampaignClosed(campaignAddress, stateContract.FUNGIBLE());
        } else if (tokenType == stateContract.NFT()) {
            require(
                !stateContract.getIsCampaignClosed(
                    campaignAddress,
                    stateContract.NFT()
                ),
                "Campaign already closed"
            );
            stateContract.setIsCampaignClosed(
                campaignAddress,
                stateContract.NFT(),
                true
            );
            stateContract.setCampaignEndTime(
                campaignAddress,
                stateContract.NFT(),
                block.timestamp + campaignExpiryTime
            );
            emit CampaignClosed(campaignAddress, stateContract.NFT());
        } else {
            revert("Invalid token type");
        }
    }

    /**
     * @dev Distribute fungible tokens to the campaigner
     * @param tokenId The address of the token in solidity format
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param tokenTotalAmount The total amount of tokens to be distributed
     * @param tokenType The type of the token (FUNGIBLE or NFT)
     * @param receiversAddresses The addresses of the receivers (max 50 addresses in one call)
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
            stateContract.getIsCampaignClosed(campaignAddress, tokenType),
            "Campaign is not closed"
        );

        uint64 newCampaignBalance = stateContract.getTokenCampaignBalance(
            campaignAddress,
            tokenId,
            tokenType
        ) - uint64(tokenTotalAmount);
        stateContract.setTokenCampaignBalance(
            campaignAddress,
            tokenId,
            tokenType,
            newCampaignBalance
        );

        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            uint64 newRewardBalance = stateContract.getRewardTokenBalance(
                recipient,
                tokenId,
                tokenType
            ) + uint64(amount);
            stateContract.setRewardTokenBalance(
                recipient,
                tokenId,
                tokenType,
                newRewardBalance
            );
        }
    }

    /**
     * @dev Distribute HBAR tokens to the campaigner
     * @param campaigner The solidity address of the campaigner or wallet address
     * @param campaignAddress The db address of the campaign
     * @param totalAmount The total amount of tokens to be distributed
     * @param receiversAddresses The addresses of the receivers (max 50 addresses in one call)
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
            stateContract.getIsCampaignClosed(
                campaignAddress,
                stateContract.HBAR()
            ),
            "Campaign is not closed"
        );
        require(
            receiversAddresses.length == amounts.length,
            "Mismatched input arrays"
        );

        // Ensure the campaign has enough balance to distribute
        require(
            stateContract.getCampaignBalance(campaignAddress) >= totalAmount,
            "Insufficient campaign balance to distribute amount"
        );

        // Deduct the distributed amount from the campaign's balance
        uint256 newCampaignBalance = stateContract.getCampaignBalance(
            campaignAddress
        ) - totalAmount;
        stateContract.setCampaignBalance(campaignAddress, newCampaignBalance);

        for (uint i = 0; i < receiversAddresses.length; i++) {
            address recipient = receiversAddresses[i];
            uint256 amount = amounts[i];
            uint256 newRewardBalance = stateContract.getRewardBalance(
                recipient
            ) + amount;
            stateContract.setRewardBalance(recipient, newRewardBalance);
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
            stateContract.getIsCampaignClosed(campaignAddress, tokenType),
            "Campaign is not closed"
        );
        require(
            block.timestamp >
                stateContract.getCampaignEndTime(campaignAddress, tokenType),
            "Campaign not ended"
        );

        stateContract.setTokenBalance(
            campaigner,
            tokenId,
            tokenType,
            stateContract.getTokenBalance(campaigner, tokenId, tokenType) +
                stateContract.getTokenCampaignBalance(
                    campaignAddress,
                    tokenId,
                    tokenType
                )
        );
        stateContract.setTokenCampaignBalance(
            campaignAddress,
            tokenId,
            tokenType,
            0
        );
        emit CampaignExpired(campaignAddress, tokenType);
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
            block.timestamp >
                stateContract.getCampaignEndTime(
                    campaignAddress,
                    stateContract.HBAR()
                ),
            "Campaign not ended"
        );
        require(
            stateContract.getIsCampaignClosed(
                campaignAddress,
                stateContract.HBAR()
            ),
            "Campaign is not closed"
        );

        stateContract.setBalance(
            campaigner,
            stateContract.getBalance(campaigner) +
                stateContract.getCampaignBalance(campaignAddress)
        );
        stateContract.setCampaignBalance(campaignAddress, 0);
        emit CampaignExpired(campaignAddress, stateContract.HBAR());
    }
}
