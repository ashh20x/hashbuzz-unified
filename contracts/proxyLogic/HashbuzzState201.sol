// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./States.sol";

contract HashbuzzState201 is HashbuzzStates {
    address public logicContract;

    event LogicContractUpdated(address indexed newLogicContract);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }

    /**
     * @dev Updates the logic contract, restricted to the owner only
     * @param _newLogic Address of the new logic contract
     */
    function setLogicContract(address _newLogic) external {
        require(
            msg.sender == owner,
            "Unauthorize Access requested, Caller is not the owner"
        );
        require(_newLogic != address(0), "Invalid new logic contract address");
        require(
            _newLogic != logicContract,
            "Already using this logic contract"
        );
        logicContract = _newLogic;
        emit LogicContractUpdated(_newLogic);
    }
}
