import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "King"
const CONTRACT_NAME_ATTACKER = "KingAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let contract: Contract
    let attackerContract: Contract
    let tx: TransactionResponse

    beforeEach(async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const initialPrize = ethers.utils.parseEther("0.001")

        const factory = await ethers.getContractFactory(CONTRACT_NAME)
        contract = await factory.deploy( { value: initialPrize } )
        await contract.deployed()
    })

    it("Should be possible to get kingship and prevent attempt to reclaim it", async () => {
        expect(await contract.king()).to.eq(owner.address)

        let surpassPrize = ethers.utils.parseEther("0.002")

        const attackerFactory = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        attackerContract = await attackerFactory.connect(attacker).deploy(contract.address, { value: surpassPrize })
        await attackerContract.deployed()

        expect(await contract.king()).to.eq(attackerContract.address)

        surpassPrize = ethers.utils.parseEther("0.003")
        await expect(owner.sendTransaction({ to: contract.address, value: surpassPrize }))
            .to.be.revertedWith("fails king.transfer")
    })
})