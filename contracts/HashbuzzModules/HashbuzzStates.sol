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

    mapping(uint32 => mapping(address => bool)) public whitelistedToken;
    mapping(uint32 => address[]) internal whitelistedAddresses;

    mapping(address => mapping(address => mapping(uint256 => uint64)))
        public tokenBalances;

    mapping(string => uint256) public campaignBalances;
    mapping(string => mapping(address => mapping(uint256 => uint64)))
        public tokenCampaignBalances;

    mapping(string => mapping(uint256 => uint256)) campaignEndTime;
    mapping(address => uint32) public nftCampaigner;
    mapping(string => mapping(uint256 => bool)) isCampaignClosed;
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
    event CampaignToppedUp(
        string campaignAddress,
        uint256 amount,
        uint32 tokenType
    );

    // Error codes
    string constant ERR_INVALID_TOKEN_ADDRESS = "E001";
    string constant ERR_INVALID_CAMPAIGN_ADDRESS = "E002";
    string constant ERR_CAMPAIGNER_NOT_ALLOWED = "E003";
    string constant ERR_CAMPAIGN_NOT_CLOSED = "E004";
    string constant ERR_TOKEN_NOT_WHITELISTED = "E005";
    string constant ERR_CAMPAIGN_ALREADY_EXISTS = "E006";
    string constant CURRENT_BALANCE_IS_NON_ZERO = "E007";
    string constant ERR_INSUFFICIENT_BALANCE = "E008";
    string constant ERR_NON_ZERO_BAL = "E009";
    string constant ERR_INVALID_EXPIRY_TIME = "E010";
    string constant ERR_TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO = "E011";
    string constant ERR_MISMATCHED_INPUT_ARRAYS = "E012";
    string constant ERR_TOTAL_REWARD_EXCEEDS_CAMPAIGN_BALANCE = "E013";
    string constant ERR_TCAMPAIGN_ALREADY_CLOSED = "E014";
    string constant ERR_TOKEN_IS_NOT_FUNGIBLE = "E015";
    string constant ERR_INVALID_TOKEN_TYPE = "E016";

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
