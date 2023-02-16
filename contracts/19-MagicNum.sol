// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MagicNum {
    address public solver;

    constructor() {}

    function setSolver(address _solver) public {
        solver = _solver;
    }

    /*
    ____________/\\\_______/\\\\\\\\\_____
     __________/\\\\\_____/\\\///////\\\___
      ________/\\\/\\\____\///______\//\\\__
       ______/\\\/\/\\\______________/\\\/___
        ____/\\\/__\/\\\___________/\\\//_____
         __/\\\\\\\\\\\\\\\\_____/\\\//________
          _\///////////\\\//____/\\\/___________
           ___________\/\\\_____/\\\\\\\\\\\\\\\_
            ___________\///_____\///////////////__
  */
}


interface IMagicNum {
    function setSolver(address) external;
}

contract MagicNumAttacker {
    IMagicNum public magic;

    constructor(address _targetAddress) {
        magic = IMagicNum(_targetAddress);
    }

    function attack() public {
        address solver;
        bytes32 salt = 0;
        bytes memory bytecode = hex"600a600c600039600a6000f3602a60005260206000f3";

        assembly {
            solver := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        magic.setSolver(solver);
    }
}