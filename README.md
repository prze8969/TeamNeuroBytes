# KisanSetu (TeamNeuroBytes)

KisanSetu is a decentralized agricultural marketplace engineered to strengthen market linkages, facilitate AI-driven crop quality grading, and guarantee transaction trust through milestone-based escrow smart contracts.

## Deployed Contracts (Polygon Amoy Testnet - Chain ID: 80002)

| Contract | Address | Explorer Link |
| :--- | :--- | :--- |
| **TestToken** | `0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d` | [Amoy Polygonscan](https://amoy.polygonscan.com/address/0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d) |
| **Roles** | `0x06d95F59142eAA3c5f06757c43F6C4db54b73c16` | [Amoy Polygonscan](https://amoy.polygonscan.com/address/0x06d95F59142eAA3c5f06757c43F6C4db54b73c16) |
| **GradeRegistry** | `0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C` | [Amoy Polygonscan](https://amoy.polygonscan.com/address/0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C) |
| **EscrowManager** | `0xB0cA0E341006238BcCCc46cd7Bebd25297794860` | [Amoy Polygonscan](https://amoy.polygonscan.com/address/0xB0cA0E341006238BcCCc46cd7Bebd25297794860) |
| **DisputeArbiter** | `0xfa56743872bc0457C3667609677EE0877d340E5e` | [Amoy Polygonscan](https://amoy.polygonscan.com/address/0xfa56743872bc0457C3667609677EE0877d340E5e) |

---

## Repository Structure

* `blockchain/`: Foundry-based Solidity contracts, Forge deploy scripts, and automated test suites.
* `backend/`: Python FastAPI app exposing market linkages, APMC price predictions, and AI Vision grading APIs.
* `frontend/`: Next.js React client providing intuitive dashboards for farmers, buyers, and transporters.

---

## Dual-Signing Transaction Model

* **User Actions:** Core state mutations (accepting bids, locking escrow, lodging disputes) are initiated client-side by user MetaMask wallets.
* **System Actions:** Sensor logs (weighbridge receipts, AI visual grade anchors) are relayed and signed by our backend hot wallet (`web3.py`) to reduce UX friction for non-technical users.
