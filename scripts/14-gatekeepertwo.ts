import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "GatekeeperTwo"
const CONTRACT_ADDRESS = "0xC689d2cF74Be32f7CDB2135061c173A47209C378"
const CONTRACT_NAME_ATTACKER = "GatekeeperTwoAttacker"

async function main() {
    const GatekeeperTwoAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const gatekeeperAttacker = await GatekeeperTwoAttacker.connect(attacker).deploy(CONTRACT_ADDRESS)
    await gatekeeperAttacker.deployed()

    console.log("GatekeeperTwo: pasted the gatekeeper and registered as an entrant");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });