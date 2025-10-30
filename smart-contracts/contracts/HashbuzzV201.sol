// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import "./HashbuzzModules/HashbuzzStates.sol";
import "./HashbuzzModules/Utils.sol";
import "./HashbuzzModules/CampaignLifecycle.sol";
import "./HashbuzzModules/Transactions.sol";

contract HashbuzzV201 is HashbuzzStates, Utils, Lifecycle, Transactions {
    constructor() {
        owner = msg.sender;
        emit OwnerSet(owner);
    }
}
