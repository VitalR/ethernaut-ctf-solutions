import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { ShopAttacker__factory, Shop__factory } from "../typechain"

const CONTRACT_NAME = "Shop"
const CONTRACT_NAME_ATTACKER = "ShopAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let contract, contractAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to get the item from the shop for less than the price asked", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        contract = await new Shop__factory(owner).deploy()

        contractAttacker = await new ShopAttacker__factory(attacker).deploy()

        expect(await contract.price()).to.eq(100)
        expect(await contract.isSold()).to.eq(false)

        tx = await contractAttacker.connect(attacker).attack(contract.address)
        await tx.wait()

        expect(await contract.price()).to.eq(1)
        expect(await contract.isSold()).to.eq(true)
    })
})