import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "MagicNum"
const CONTRACT_ADDRESS = "0x1b807D33516cdd32E6271f37115f980883D4f790"
const CONTRACT_NAME_ATTACKER = "MagicNumAttacker"

async function main() {
    const MagicNum = await ethers.getContractFactory(CONTRACT_NAME)
    const magicNum = MagicNum.attach(CONTRACT_ADDRESS)

    const MagicNumAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const magicNumAttacker = await MagicNumAttacker.connect(attacker).deploy(CONTRACT_ADDRESS)
    await magicNumAttacker.deployed()

    let tx: TransactionResponse = await magicNumAttacker.connect(attacker).attack()
    await tx.wait()

    console.log("MagicNum: provided a Solver contract with the right number");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });