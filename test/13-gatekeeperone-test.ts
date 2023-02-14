import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, BigNumber } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Elevator__factory, GatekeeperOneAttacker__factory, GatekeeperOne__factory } from "../typechain"

const CONTRACT_NAME = "GatekeeperOne"
const CONTRACT_NAME_ATTACKER = "GatekeeperOneAttacker"

describe(CONTRACT_NAME, () => {
    let owner: SignerWithAddress
    let attacker: SignerWithAddress
    let gatekeeper: Contract
    let gatekeeperAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to past the gatekeeper and register as an entrant", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        gatekeeper = await new GatekeeperOne__factory(owner).deploy()
        gatekeeperAttacker = await new GatekeeperOneAttacker__factory(attacker).deploy(gatekeeper.address)

        tx = await gatekeeperAttacker.connect(attacker).attack()
        await tx.wait()

        expect(await gatekeeper.entrant()).to.eq(attacker.address)
        
    })
})