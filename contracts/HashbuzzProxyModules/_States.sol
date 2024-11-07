// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title HashbuzzStates
 * @dev This contract is used to store the state of the Hashbuzz contract
 */

contract States {
    address public owner;
    address internal logicContract;

    uint32 public constant HBAR = 0;
    uint32 public constant FUNGIBLE = 1;
    uint32 public constant NFT = 2;

    mapping(address => bool) internal campaigners;
    mapping(address => uint256) internal balances;
    mapping(address => uint256) internal rewardBalances;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        internal tokenBalances;
    mapping(address => mapping(address => mapping(uint256 => uint64)))
        internal rewardTokenBalances;
    mapping(string => uint256) internal campaignBalances;
    mapping(string => mapping(address => mapping(uint256 => uint64)))
        internal tokenCampaignBalances;
    mapping(address => mapping(address => mapping(uint256 => bool)))
        internal associateCampainer;
    mapping(string => mapping(uint256 => uint256)) internal campaignEndTime;
    mapping(address => uint32) internal nftCampaigner;
    mapping(string => mapping(uint256 => bool)) internal isCampaignClosed;
    uint32 internal id = 1;
    mapping(string => uint32) internal campaignRandomNumber;

    event OwnerSet(address owner);
    event LogicContractUpdated(address indexed newLogicContract);
}
