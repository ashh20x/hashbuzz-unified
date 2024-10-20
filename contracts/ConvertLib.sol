// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

library ConvertLib {
    function convert(
        uint amount,
        uint conversionRate
    ) public pure returns (uint convertedAmount) {
        return amount * conversionRate;
    }
}
