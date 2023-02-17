import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { MagicNumAttacker__factory, MagicNum__factory } from "../typechain"

const CONTRACT_NAME = "MagicNum"
const CONTRACT_NAME_ATTACKER = "MagicNumAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let magicNum, magicNumAttacker: Contract
    let tx: TransactionResponse

    const abi = ["function whatIsTheMeaningOfLife() pure returns (uint)"];

    it("Should be possible provide a Solver contract that responds with the right number", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        magicNum = await new MagicNum__factory(owner).deploy()
        magicNumAttacker = await new MagicNumAttacker__factory(attacker).deploy(magicNum.address)

        tx = await magicNumAttacker.connect(attacker).attack()
        await tx.wait()

        const solverAddress = await magicNum.solver()

        const solver = await ethers.getContractAt(abi, solverAddress)

        const life = await solver.whatIsTheMeaningOfLife()

        expect(life).to.eq(42)
    })

    it("Should be possible provide a Solver contract that responds to whatIsTheMeaningOfLife() with the right number", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        magicNum = await new MagicNum__factory(owner).deploy()

        const initOpcode = "600a600c600039600a6000f3";
        const runtimeOpcode = "602a60805260206080f3";
        const bytecode = `0x${initOpcode}${runtimeOpcode}`;

        const byteFactory = new ethers.ContractFactory(abi, bytecode, ethers.provider.getSigner());
        const byteContract = await byteFactory.deploy();
        await byteContract.deployed();

        tx = await magicNum.setSolver(byteContract.address)
        await tx.wait()

        const life = await byteContract.whatIsTheMeaningOfLife()

        expect(life).to.eq(42)
    })
})