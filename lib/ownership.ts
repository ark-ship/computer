import { ethers } from "ethers";
import {
  CHAIN_ID,
  NFT_CONTRACT,
  RPC_URL,
} from "./config";

const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

export async function getHolderBalance(address: string): Promise<bigint> {
  if (!NFT_CONTRACT) {
    throw new Error("NFT contract is not configured.");
  }

  const provider = new ethers.JsonRpcProvider(
    RPC_URL,
    CHAIN_ID,
    { staticNetwork: true }
  );

  const contract = new ethers.Contract(
    NFT_CONTRACT,
    ERC721_ABI,
    provider
  );

  return BigInt((await contract.balanceOf(address)).toString());
}

export async function assertHolder(address: string) {
  const balance = await getHolderBalance(address);

  if (balance <= 0n) {
    throw new Error("WALLET_DOES_NOT_OWN_COMPUTER");
  }

  return balance;
}