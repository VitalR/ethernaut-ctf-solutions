import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { AlienCodexAttacker__factory, AlienCodex__factory } from "../typechain"

const CONTRACT_NAME = "AlienCodex"
const CONTRACT_NAME_ATTACKER = "AlienCodexAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let contract, contractAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to claim ownership of the contract", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        contract = await new AlienCodex__factory(owner).deploy()

        contractAttacker = await new AlienCodexAttacker__factory(attacker).deploy()

        expect(await contract.owner()).to.eq(owner.address)

        tx = await contractAttacker.connect(attacker).attack(contract.address)
        await tx.wait()

        expect(await contract.owner()).to.eq(attacker.address)
    })
})