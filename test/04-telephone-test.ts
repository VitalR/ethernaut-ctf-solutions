import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Telephone"
const CONTRACT_NAME_ATTACKER = "TelephoneAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let contract: Contract
    let attackerContract: Contract
    let tx: TransactionResponse

    beforeEach(async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const factory = await ethers.getContractFactory(CONTRACT_NAME)
        contract = await factory.deploy()
        await contract.deployed()

        const attackerFactory = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        attackerContract = await attackerFactory.connect(attacker).deploy(contract.address)
        await attackerContract.deployed()
    })

    it("Should be possible to claim ownership of the contract", async () => {
        tx = await attackerContract.connect(attacker).changeOwnership()
        await tx.wait()

        expect(await contract.owner()).to.eq(attacker.address)
    })
})


