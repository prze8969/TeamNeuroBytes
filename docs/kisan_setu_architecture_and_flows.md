# KisanSetu: System Architecture & Ecosystem Flow

This document provides a comprehensive summary of the KisanSetu repository's entire filesystem architecture, followed by detailed step-by-step user flows for every stakeholder interacting with the platform.

---

## 📂 Part 1: Monorepo Filesystem Architecture

The repository is structured as a modern monorepo, divided into three major technical domains: the Next.js Frontend, the FastAPI Backend, and the Foundry Smart Contracts.

### 1. `frontend/` (Next.js Application)
The frontend is a robust, responsive web application built with Next.js (App Router), Tailwind CSS, and Ethers.js for Web3 interactions.
* **`app/`**: Contains the route definitions and layouts for all stakeholder portals.
  * `/farmer`: Dashboard for producers to list crops and view AI grading results.
  * `/buyer`: Marketplace and bidding interface for traders.
  * `/warehouse`: APMC weighbridge integration and delivery confirmation screens.
  * `/transportation`: Logistics hub for managing transit assignments and pickup advances.
  * `/admin` & `/blockchain`: Governance and public Trust Protocol tracking pages.
* **`components/`**: Reusable UI components.
  * `dashboard/`: Contains specific layouts like `BuyerDashboardLayout.tsx` and interactive components like `BiddingDrawer.tsx`.
  * `layout/`: Global wrappers like `Navbar.tsx` which houses the multilingual switcher and role-based navigation.
* **`lib/`**: Core utilities and state management.
  * `AuthContext.tsx` & `LocaleContext.tsx`: Manages user sessions and multilingual (8+ languages) dictionary states.
  * `useBuyerState.ts`: Critical state hook that wires frontend logic to MetaMask, executing `approve()` and `createOrder()` on-chain.
  * `web3.ts`: Ethers.js provider initialization and Polygon Amoy network auto-switching logic.
  * `abis/`: Contains synchronized JSON representations of our deployed Smart Contracts.

### 2. `backend/` (FastAPI Python Service)
The backend acts as the centralized API gateway, AI processor, and Gasless Relayer for system-level blockchain transactions.
* **`app/main.py`**: The FastAPI application entry point.
* **`app/services/`**:
  * `chain_client.py`: The `web3.py` client that securely holds the Backend Admin Private Key, executing system-level smart contract calls (e.g., `submitGrade`).
  * `event_listener.py`: A background polling daemon that listens to Amoy blocks every 2 seconds to catch events like `OrderCreated` and sync them into the PostgreSQL database.
  * `weighbridge.py`: Simulates IoT edge sensor integrations to automatically trigger settlement pipelines upon crop delivery.
* **`app/core/abis/`**: Synchronized smart contract ABIs for backend encoding.
* **`.env`**: Secure environment file holding the `ADMIN_PRIVATE_KEY` and RPC URLs.

### 3. `blockchain/` (Foundry Solidity Environment)
The decentralized trust layer, written in Solidity and deployed to the Polygon Amoy testnet.
* **`src/`**:
  * `TestToken.sol`: An ERC-20 stablecoin mock used to simulate instant, zero-friction DBT settlements.
  * `Roles.sol`: OpenZeppelin AccessControl registry that permissions actions to specific addresses.
  * `GradeRegistry.sol`: Quality ledger where AI (YOLOv8/DINOv2) crop grading hashes are permanently anchored.
  * `EscrowManager.sol`: The master settlement contract. It locks buyer funds, releases 30% logistics fuel advances, and processes final weighbridge payouts.
  * `DisputeArbiter.sol`: Governance contract allowing Mandi officials to enforce refunds or penalties.
* **`script/`**: Contains `Deploy.s.sol` for deterministic deployments.

### 4. Auxiliary Directories
* **`scratch/`**: Contains Python scripts (e.g., `execute_full_onchain_cycle.py`, `verify_setup.py`) used by developers and AI agents to test end-to-end on-chain pipelines without clicking through the UI.
* **`docs/`**: Documentation including `blockchain-integration.md` and standard architectural guidelines (`AGENTS.md`, `README.md`, `test.md`).

---

## 🔄 Part 2: Detailed Stakeholder User Flows

KisanSetu orchestrates a multi-party supply chain. Here is the exact flow of data, state, and capital as users interact with the website.

### 🧑‍🌾 1. The Farmer (Producer) Flow
1. **Login & KYC**: Farmer logs into `/farmer/dashboard` via DigiLocker.
2. **Crop Listing**: The farmer uploads images of their harvested crop (e.g., Onions, Wheat) and submits lot details (weight, location).
3. **AI Grading (System Action)**: The backend processes the images using AI models. 
4. **On-Chain Anchoring**: The `chain_client.py` takes the AI grade result, hashes it (SHA-256), and signs a `submitGrade()` transaction to the `GradeRegistry` contract, ensuring the quality metric cannot be tampered with.
5. **Market Visibility**: The lot appears live on the buyer marketplace.

### 🏢 2. The Buyer Flow
1. **Market Discovery**: Buyer browses available, AI-graded lots on `/buyer/dashboard`.
2. **Bid Placement**: Buyer evaluates the lot and initiates a buy order.
3. **MetaMask Escrow Lock (Client Action)**:
   - When the buyer confirms, `web3.ts` prompts their MetaMask wallet.
   - **Transaction 1**: `approve()` - The buyer authorizes the `EscrowManager` to spend the required `TestToken` amount.
   - **Transaction 2**: `createOrder()` - The buyer locks the combined cost of the crop, logistics freight, and a 1.5% APMC cess into the immutable escrow smart contract.
4. **Order Confirmation**: The `event_listener.py` detects the `OrderCreated` blockchain event and updates the centralized database.

### 🚛 3. The Transporter (Logistics) Flow
1. **Assignment**: Transporter views their assigned route on `/transportation/dashboard`.
2. **Physical Pickup**: The transporter arrives at the farm and verifies the crop payload.
3. **Mark Picked Up**: The transporter clicks "Confirm Pickup" on their dashboard.
4. **Fuel Advance Payout**: The Escrow contract transitions the order state to `PickedUp` (State 1) and instantly disburses a **30% upfront freight payout** to the transporter's wallet to cover immediate fuel costs.

### ⚖️ 4. The APMC Warehouse Flow
1. **Arrival & Weighbridge**: The transporter arrives at the Mandi/Warehouse. The truck drives onto the physical IoT weighbridge.
2. **Sensor Relay**: The weighbridge records the final verified weight and sends it to the backend `weighbridge.py` service.
3. **Delivery Settlement (System Action)**: 
   - The backend relayer (funded with POL) signs and submits the `confirmDelivery()` transaction to the `EscrowManager` on-chain.
   - **Final Payouts**: The smart contract instantly distributes the remaining 100% crop payment to the Farmer and the final 70% freight payout to the Transporter via Direct Benefit Transfer (TestToken).
   - Order transitions to `Settled` (State 3).

### 🏛️ 5. The Admin & Regulator Flow
1. **Monitoring Trust**: Regulators log into the `/admin/dashboard` and can view the public Trust Protocol page at `/blockchain`.
2. **Audit Trails**: They can track live E2E transaction receipts linking directly to Polygonscan Amoy, verifying that all AI hashes, escrow locks, and payouts occurred immutably.
3. **Dispute Resolution**: If a physical dispute arises (e.g., crop rot in transit), the regulator uses the simulated `DisputeArbiter` dashboard to manually override escrow flows before final settlement.

---

> [!TIP]
> **Zero-Trust Advantage**
> Because system-level transactions (like weighbridge confirmations) are handled by a backend Gasless Relayer, Farmers and Transporters do not need to install MetaMask or hold POL for gas fees. They simply receive their stablecoin payouts instantly and automatically as the physical milestones are completed.
