import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, providers } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Force"
const CONTRACT_NAME_ATTACKER = "ForceAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let force: Contract
    let forceAttacker: Contract

    it("Should be possible to make the balance of the contract greater than zero", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const [ Force, ForceAttacker ] = await Promise.all([
            await ethers.getContractFactory(CONTRACT_NAME),
            await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        ])

        force = await Force.deploy()
        await force.deployed()

        expect(await ethers.provider.getBalance(force.address)).to.eq(0)

        forceAttacker = await ForceAttacker.connect(attacker).deploy(force.address, { value: 1 })
        await forceAttacker.deployed()

        expect(await ethers.provider.getBalance(force.address)).be.gt(0)
    })
})