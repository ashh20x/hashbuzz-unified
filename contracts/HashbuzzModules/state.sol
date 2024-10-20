// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title State
 * @dev This contract is used to store the state of the Hashbuzz contract
 */
contract State {
    uint32 public constant HBAR = 0;
    uint32 public constant FUNGIBLE = 1;
    uint32 public constant NFT = 2;

    address internal owner;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public rewardBalances;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public tokenBalances;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public rewardTokenBalances;
    mapping(string => uint256) public campaignBalances;
    mapping(string => mapping(address => mapping(uint256 => uint64)))
        public tokenCampaignBalances;
    mapping(address => mapping(address => mapping(uint256 => bool))) associateCampainer;
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

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
}
