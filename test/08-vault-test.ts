import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, providers } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Vault__factory } from "../typechain"

const CONTRACT_NAME = "Vault"

describe(CONTRACT_NAME, () => {
    let vault: Contract
    let tx: TransactionResponse

    it("Should be possible to unlock the vault", async () => {
        const signers = await ethers.getSigners()

        const password = "secret_password"
        const bytesPassword = ethers.utils.formatBytes32String(password)

        vault = await new Vault__factory(signers[0]).deploy(bytesPassword)

        expect(await vault.locked()).to.eq(true)

        const passw = await ethers.provider.getStorageAt(vault.address, 1)

        tx = await vault.unlock(passw)
        await tx.wait()

        expect(await vault.locked()).to.eq(false)
    })
})