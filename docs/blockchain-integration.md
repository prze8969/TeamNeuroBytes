# Blockchain Integration & Signing Model

This document outlines the transaction signing model and Polygon Amoy configuration details for developers.

## Network Parameters

* **Network Name:** Polygon Amoy Testnet
* **Chain ID:** `80002` (Hex: `0x13882`)
* **RPC URL:** `https://polygon-amoy-bor-rpc.publicnode.com`
* **Block Time:** ~2 seconds (as opposed to instant mining on local Anvil)

---

## Dual-Signing Architecture

To optimize the UX for rural farmers and logistics operators, KisanSetu utilizes a hybrid signing architecture:

```
                  +--------------------------------+
                  |    User Actions (MetaMask)     |
                  |  - Approve token locks         |
                  |  - Place bid                   |
                  |  - Accept bid / raise dispute  |
                  +---------------+----------------+
                                  |
                                  v
                    [Polygon Amoy Blockchain]
                                  ^
                                  |
                  +---------------+----------------+
                  |  System Relayer (web3.py)      |
                  |  - Anchor AI grade hashes      |
                  |  - Submit weighbridge weight   |
                  |  - Trigger escrow settlements  |
                  +--------------------------------+
```

### 1. User-Initiated Actions (Client-Side)
* **Wallet:** MetaMask (Browser Extension or Mobile).
* **Scope:** Any action where the user consents to locking funds or committing to an agreement (e.g. buyer deposits, bidder acceptances, dispute lodge).
* **Implementation:** Standard `ethers.js` Provider/Signer instantiation from `window.ethereum` in `frontend/lib/web3.ts`.

### 2. System-Initiated Actions (Server-Relayed)
* **Wallet:** Backend server hot wallet (private key loaded securely into `backend/.env`).
* **Scope:** Automated actions, physical sensor assertions, or background state changes (e.g. anchoring AI vision YOLO/DINO reports to `GradeRegistry.sol` and submiting weighbridge readings in `weighbridge.py`).
* **Implementation:** Standard `web3.py` signing wrappers using private keys loaded inside `backend/app/services/chain_client.py`.
