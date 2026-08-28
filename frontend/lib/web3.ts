// frontend/lib/web3.ts
import { ethers } from "ethers";
import EscrowManagerABI from "./abis/EscrowManager.json";
import TestTokenABI from "./abis/TestToken.json";
import RolesABI from "./abis/Roles.json";
import GradeRegistryABI from "./abis/GradeRegistry.json";
import DisputeArbiterABI from "./abis/DisputeArbiter.json";

// Fetch contract addresses dynamically from Next.js environment variables
export const ESCROW_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS || "0xB0cA0E341006238BcCCc46cd7Bebd25297794860";
export const TEST_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS || "0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d";
export const ROLES_ADDRESS = process.env.NEXT_PUBLIC_ROLES_ADDRESS || "0x06d95F59142eAA3c5f06757c43F6C4db54b73c16";
export const GRADE_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_GRADE_REGISTRY_ADDRESS || "0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C";
export const DISPUTE_ARBITER_ADDRESS = process.env.NEXT_PUBLIC_DISPUTE_ARBITER_ADDRESS || "0xfa56743872bc0457C3667609677EE0877d340E5e";

export async function getSigner() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask extension not found. Please install a compatible Web3 wallet.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export function getEscrowContract(signer: ethers.Signer) {
  return new ethers.Contract(ESCROW_MANAGER_ADDRESS, EscrowManagerABI.abi, signer);
}

export function getTestTokenContract(signer: ethers.Signer) {
  return new ethers.Contract(TEST_TOKEN_ADDRESS, TestTokenABI.abi, signer);
}

export function getRolesContract(signer: ethers.Signer) {
  return new ethers.Contract(ROLES_ADDRESS, RolesABI.abi, signer);
}

export function getGradeRegistryContract(signer: ethers.Signer) {
  return new ethers.Contract(GRADE_REGISTRY_ADDRESS, GradeRegistryABI.abi, signer);
}

export function getDisputeArbiterContract(signer: ethers.Signer) {
  return new ethers.Contract(DISPUTE_ARBITER_ADDRESS, DisputeArbiterABI.abi, signer);
}

export async function ensureAmoyNetwork() {
  if (typeof window === "undefined" || !window.ethereum) return;
  
  const targetChainId = "0x13882"; // Hex for 80002 (Polygon Amoy Testnet)
  
  try {
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
    if (currentChainId !== targetChainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError: any) {
        // Error code 4902 indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: targetChainId,
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: {
                name: "POL",
                symbol: "POL",
                decimals: 18
              },
              rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://polygon-amoy-bor-rpc.publicnode.com"],
              blockExplorerUrls: ["https://amoy.polygonscan.com/"]
            }],
          });
        } else {
          throw switchError;
        }
      }
    }
  } catch (error) {
    console.error("Failed to switch or add the Polygon Amoy network in MetaMask:", error);
  }
}