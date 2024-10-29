// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title HashbuzzStates
 * @dev This contract is used to store the state of the Hashbuzz contract
 */
contract HashbuzzStates {
    address internal owner;

    uint32 public constant HBAR = 0;
    uint32 public constant FUNGIBLE = 1;
    uint32 public constant NFT = 2;

    mapping(address => bool) internal campaigners;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public rewardBalances;

    mapping(uint32 => mapping(address => bool)) public whitelistedToken;
    mapping(uint32 => address[]) internal whitelistedAddresses;

    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public tokenBalances;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public rewardTokenBalances;
    mapping(string => uint256) public campaignBalances;
    mapping(string => mapping(address => mapping(uint256 => uint64)))
        public tokenCampaignBalances;

    mapping(string => mapping(uint256 => uint256)) campaignEndTime;
    mapping(address => uint32) public nftCampaigner;
    mapping(string => mapping(uint256 => bool)) isCampaignClosed;
    uint32 public id = 1;
    mapping(string => uint32) public campaignRandomNumber;

    event OwnerSet(address owner);
    event CampaignerDeleted(address campaigner);
    event CampaignerAdded(address campaigner);
    event FundsDeposited(address campaigner, uint256 amount);
    event FundsWithdrawn(address campaigner, uint256 amount);
    event campaignClosed(string campaignAddress, uint32 campaignType);
    event campaignExpired(string campaignAddress, uint32 campaignType);
    event InteractorPaid(
        address interactor,
        address campaigner,
        uint256 amount
    );
    event InteractorPaidDeferred(string campaignAddress, uint256 amount);
    event NewCampaignIsAdded(
        string campaignAdddress,
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
    event RewardsDistributed(
        string campaignAddress,
        uint256 totalAmount,
        uint256 remainingBalance
    );

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
}
