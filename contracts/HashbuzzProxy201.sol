// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

contract ProxyContract {
    address public logicContract;
    address public stateContract;

    event LogicContractUpdated(address indexed newLogicContract);

    constructor(address _logicContract, address _stateContract) {
        require(_logicContract != address(0), "Invalid logic contract address");
        require(_stateContract != address(0), "Invalid state contract address");
        logicContract = _logicContract;
        stateContract = _stateContract;
    }

    modifier onlyOwner() {
        (bool success, bytes memory data) = stateContract.staticcall(
            abi.encodeWithSignature("owner()")
        );
        require(success, "Failed to fetch owner");
        address owner = abi.decode(data, (address));
        require(msg.sender == owner, "Unauthorized: Not the owner");
        _;
    }

    /**
     * @dev Updates the logic contract address, restricted to the owner
     * @param _newLogic Address of the new logic contract
     */
    function setLogicContract(address _newLogic) external onlyOwner {
        require(_newLogic != address(0), "Invalid new logic contract address");
        require(
            _newLogic != logicContract,
            "Already using this logic contract"
        );

        logicContract = _newLogic;
        emit LogicContractUpdated(_newLogic);

        // Update the logic contract in the state contract
        (bool success, ) = stateContract.call(
            abi.encodeWithSignature("setLogicContract(address)", _newLogic)
        );
        require(success, "Failed to update logic contract in state");
    }

    /**
     * @dev Fallback function to delegate calls to the logic contract
     */
    fallback() external payable {
        (bool success, bytes memory result) = logicContract.delegatecall(
            msg.data
        );
        if (!success) {
            // Forward revert reason for better debugging
            assembly {
                revert(add(result, 0x20), mload(result))
            }
        }
    }

    receive() external payable {}
}
