import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "CoinFlip"
const CONTRACT_NAME_ATTACKER = "CoinFlipAttacker"

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

    it("Should be possible to guess the correct outcome 10 times", async () => {
        for (let i = 0; i < 10; i++) {
            tx = await attackerContract.connect(attacker).attack()
            await tx.wait(1)
        }

        expect(await contract.consecutiveWins()).to.eq(10)
        expect(await attackerContract.connect(attacker).continualWins()).to.eq(10)
    })
})


