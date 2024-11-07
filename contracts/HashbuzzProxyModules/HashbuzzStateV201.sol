// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./_States.sol";

contract HashbuzzStateV201 is States {
    /**
     * @dev Constructor to set the owner of the contract
     */
    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Not the owner");
        _;
    }
    modifier onlyLogicContractOrOwner() {
        require(
            msg.sender == logicContract || msg.sender == owner,
            "Unauthorized: Not the logic contract or owner"
        );
        _;
    }

    function setLogicContract(address _logicContract) external onlyOwner {
        logicContract = _logicContract;
    }

    // Campaigner Management
    function addCampaigner(
        address _campaigner
    ) external onlyLogicContractOrOwner {
        campaigners[_campaigner] = true;
    }

    function deleteCampaigner(
        address _campaigner
    ) external onlyLogicContractOrOwner {
        campaigners[_campaigner] = false;
    }

    function isCampaigner(address _campaigner) external view returns (bool) {
        return campaigners[_campaigner];
    }

    // Balance Management
    function setBalance(
        address _campaigner,
        uint256 _amount
    ) external onlyLogicContractOrOwner {
        balances[_campaigner] = _amount;
    }

    function getBalance(address _campaigner) external view returns (uint256) {
        return balances[_campaigner];
    }

    function setRewardBalance(
        address _campaigner,
        uint256 _amount
    ) external onlyLogicContractOrOwner {
        rewardBalances[_campaigner] = _amount;
    }

    function getRewardBalance(
        address _campaigner
    ) external view returns (uint256) {
        return rewardBalances[_campaigner];
    }

    // Token Balance Management
    function setTokenBalance(
        address _campaigner,
        address _token,
        uint256 _tokenId,
        uint64 _amount
    ) external onlyLogicContractOrOwner {
        tokenBalances[_campaigner][_token][_tokenId] = _amount;
    }

    function getTokenBalance(
        address _campaigner,
        address _token,
        uint256 _tokenId
    ) external view returns (uint64) {
        return tokenBalances[_campaigner][_token][_tokenId];
    }

    function setRewardTokenBalance(
        address _campaigner,
        address _token,
        uint256 _tokenId,
        uint64 _amount
    ) external onlyLogicContractOrOwner {
        rewardTokenBalances[_campaigner][_token][_tokenId] = _amount;
    }

    function getRewardTokenBalance(
        address _campaigner,
        address _token,
        uint256 _tokenId
    ) external view returns (uint64) {
        return rewardTokenBalances[_campaigner][_token][_tokenId];
    }

    // Campaign Balance Management
    function setCampaignBalance(
        string calldata _campaign,
        uint256 _amount
    ) external onlyLogicContractOrOwner {
        campaignBalances[_campaign] = _amount;
    }

    function getCampaignBalance(
        string calldata _campaign
    ) external view returns (uint256) {
        return campaignBalances[_campaign];
    }

    function setTokenCampaignBalance(
        string calldata _campaign,
        address _token,
        uint256 _tokenId,
        uint64 _amount
    ) external onlyLogicContractOrOwner {
        tokenCampaignBalances[_campaign][_token][_tokenId] = _amount;
    }

    function getTokenCampaignBalance(
        string calldata _campaign,
        address _token,
        uint256 _tokenId
    ) external view returns (uint64) {
        return tokenCampaignBalances[_campaign][_token][_tokenId];
    }

    // Associate Campaigner Management
    function setAssociateCampaigner(
        address _campaigner,
        address _token,
        uint256 _tokenId,
        bool _status
    ) external onlyLogicContractOrOwner {
        associateCampainer[_campaigner][_token][_tokenId] = _status;
    }

    function isAssociateCampaigner(
        address _campaigner,
        address _token,
        uint256 _tokenId
    ) external view returns (bool) {
        return associateCampainer[_campaigner][_token][_tokenId];
    }

    // Campaign End Time Management
    function setCampaignEndTime(
        string calldata _campaign,
        uint256 _tokenId,
        uint256 _endTime
    ) external onlyLogicContractOrOwner {
        campaignEndTime[_campaign][_tokenId] = _endTime;
    }

    function getCampaignEndTime(
        string calldata _campaign,
        uint256 _tokenId
    ) external view returns (uint256) {
        return campaignEndTime[_campaign][_tokenId];
    }

    // NFT Campaigner Management
    function setNftCampaigner(
        address _campaigner,
        uint32 _nftId
    ) external onlyLogicContractOrOwner {
        nftCampaigner[_campaigner] = _nftId;
    }

    function getNftCampaigner(
        address _campaigner
    ) external view returns (uint32) {
        return nftCampaigner[_campaigner];
    }

    // Campaign Closed Management
    function setIsCampaignClosed(
        string calldata _campaign,
        uint256 _tokenId,
        bool _status
    ) external onlyLogicContractOrOwner {
        isCampaignClosed[_campaign][_tokenId] = _status;
    }

    function getIsCampaignClosed(
        string calldata _campaign,
        uint256 _tokenId
    ) external view returns (bool) {
        return isCampaignClosed[_campaign][_tokenId];
    }

    // Campaign Random Number Management
    function setCampaignRandomNumber(
        string calldata _campaign,
        uint32 _randomNumber
    ) external onlyLogicContractOrOwner {
        campaignRandomNumber[_campaign] = _randomNumber;
    }

    function getCampaignRandomNumber(
        string calldata _campaign
    ) external view returns (uint32) {
        return campaignRandomNumber[_campaign];
    }
}
