import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { GatekeeperTwoAttacker__factory, GatekeeperTwo__factory } from "../typechain"

const CONTRACT_NAME = "GatekeeperTwo"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let gatekeeper, gatekeeperAttacker: Contract

    it("Should be possible to past the gatekeeper and register as an entrant", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        gatekeeper = await new GatekeeperTwo__factory(owner).deploy()

        expect(await gatekeeper.entrant()).to.not.eq(attacker.address)

        gatekeeperAttacker = await new GatekeeperTwoAttacker__factory(attacker).deploy(gatekeeper.address)

        expect(await gatekeeper.entrant()).to.eq(attacker.address)
    })
})