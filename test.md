# KisanSetu: Testing & Verification Guide

This document describes how to test each layer of the KisanSetu platform (Smart Contracts, Backend Services, Frontend MetaMask client) and perform a complete end-to-end verification run on the Polygon Amoy testnet.

---

## 1. Smart Contract Verification (Solidity/Foundry)
To verify the core Solidity contracts and confirm the state machine behaves as expected:
1. Navigate to the contract folder:
   ```bash
   cd blockchain
   ```
2. Run the Forge test suite:
   ```bash
   forge test -v
   ```
   *Expected result: All unit tests for `Roles.sol`, `GradeRegistry.sol`, `EscrowManager.sol`, and `DisputeArbiter.sol` should pass.*

---

## 2. Backend API & Services Testing (FastAPI)
The backend manages AI visual grading, WhatsApp bots, and the relayer.
1. Run the FastAPI development server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```
2. Open the Swagger API docs: `http://localhost:8000/docs`.

### Test AI Vision grading:
* Use the `POST /api/ai/grade` endpoint to upload an agricultural image (e.g. tomato or potato).
* Verify that the JSON response returns the correct `commodity_detected`, a parsed `quality_grade` (A/B/C/REJECTED), and a `quality_score`.

### Test the Weighbridge Relayer:
* Trigger a simulated sensor confirmation by hitting the warehouse confirmation endpoints.
* Confirm that the backend hot wallet signs the transaction and returns a valid transaction hash on Polygon Amoy.

### Test the Event Listener Poller:
* Since the event poller task is decoupled from the lifespan setup, run it in a separate terminal:
   ```bash
   python -c "import asyncio; from app.services.event_listener import listen_for_events; asyncio.run(listen_for_events())"
   ```
* Verify it outputs: `🎧 Starting Blockchain Event Listener on EscrowManager...`.

---

## 3. Frontend & MetaMask client Verification (Next.js)
To test user actions, bids, and network switching:
1. Start the Next.js server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open `http://localhost:3000` in a browser with **MetaMask** installed.
3. Obtain test tokens:
   - Request test POL from the [Polygon Amoy Faucet](https://faucet.polygon.technology/).
4. Check Network prompts:
   - Click "Connect Wallet" or place a bid on a listed crop.
   - MetaMask should prompt you to switch networks. If Polygon Amoy is not configured, it should automatically display the details (Name: Polygon Amoy, Chain ID: 80002, Symbol: POL) and ask you to add the network.
5. Bid Placement:
   - Submit a bid. MetaMask should prompt you to sign the transaction payloads.

---

## 4. End-to-End Verification Checklists

Ensure a full lifecycle transaction proceeds cleanly:
1. **Grade crop** (Upload photo $\rightarrow$ returns grade & anchors SHA-256 hash).
2. **Accept bid** (Farmer accepts buyer bid on marketplace).
3. **Escrow Lock** (Buyer approves ERC20 tokens and calls `createOrder` $\rightarrow$ verifies contract locks funds).
4. **Transit Pickup** (Logistics calls `markPickedUp` $\rightarrow$ verifies 30% advance is released to transporter).
5. **Final Settlement** (Warehouse relayer calls `confirmDelivery` $\rightarrow$ verifies 100% crop payment is sent to farmer and 70% remaining freight is sent to transporter).

---

## 5. Live E2E Verification Report (Amoy Testnet)
* **Last Verified:** 2026-08-28T22:57:26Z
* **Escrow Contract:** `0xB0cA0E341006238BcCCc46cd7Bebd25297794860`
* **Test Token Contract:** `0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d`
* **Grade Registry Contract:** `0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C`

### Transaction Proofs (Order-Test ID: 38031):
1. **Warehouse Funding:** `0xf01dc714c6c6bb9e6b366e19371b7cbb0e2d0f9b5822abdceb00357a171cee4e`
2. **WAREHOUSE_ROLE Grant:** `0x86af6b03780f43aea52c08d8af83bb35cb82533eca0b126e41b48338bffb8b76`
3. **ERC-20 token approval:** `0x40cb9645ee2399b7e75718414ae2ab7a9133d35ea2de90e7e1b6fa0a7bceec1e`
4. **createOrder (Lock Escrow):** `0xaf68ae7b853201bb8109a7feb546ed54c52538b4343bf24257be7dd5605646c0`
5. **submitGrade (Grade Anchoring):** `0x0e5fb3e12102043bb0621835b2a53676c254b4543b2b4acafa22877327c23be0`
6. **markPickedUp (Transit Start):** `0x1a27a25685b6b6eac0a1da2266e247f90401fbf07d3a570c5c7062cb26ebe075`
7. **confirmDelivery (Fulfillment & Payouts):** `0xde43d1648e77b22e1355bb308d8452f8f576e799ecd05c38d30c220031d2a4e7`

*All transaction steps executed successfully and settled on-chain.*
