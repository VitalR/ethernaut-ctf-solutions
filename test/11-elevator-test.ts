import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Elevator"
const CONTRACT_NAME_ATTACKER = "ElevatorAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let elevator: Contract
    let elevatorAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to reach the top of the building", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const Elevator = await ethers.getContractFactory(CONTRACT_NAME)
        elevator = await Elevator.deploy()
        await elevator.deployed()

        const ElevatorAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        elevatorAttacker = await ElevatorAttacker.connect(attacker).deploy()
        await elevatorAttacker.deployed()

        tx = await elevatorAttacker.connect(attacker).attack(elevator.address)
        await tx.wait()

        expect(await elevator.floor()).to.eq(42)
        expect(await elevator.top()).to.eq(true)
    })
})