import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, providers } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Privacy__factory } from "../typechain"

const CONTRACT_NAME = "Privacy"

describe(CONTRACT_NAME, () => {
    let privacy: Contract
    let tx: TransactionResponse

    it("Should be possible to unlock the contract", async () => {
        const signers = await ethers.getSigners()

        const data = [
            ethers.utils.formatBytes32String('secret_data_0'),
            ethers.utils.formatBytes32String('secret_data_1'),
            ethers.utils.formatBytes32String('secret_data_2')
        ]

        privacy = await new Privacy__factory(signers[0]).deploy(data)

        expect(await privacy.locked()).to.be.true

        const dataArraySlot = 5
        const key32 = await ethers.provider.getStorageAt(privacy.address, dataArraySlot)
        const key16 = key32.slice(0, 16 * 2 + 2) // 16 bytes * 2 char + 2 char (0x)

        tx = await privacy.unlock(key16)
        await tx.wait()

        expect(await privacy.locked()).to.be.false
    })
})