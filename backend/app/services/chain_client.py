# backend/app/services/chain_client.py
import json
import os
from web3 import Web3

# Connect to the RPC URL from environment variables
RPC_URL = os.getenv("RPC_URL", "https://polygon-amoy-bor-rpc.publicnode.com")
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Backend administrative/relayer hot wallets
ADMIN_PRIVATE_KEY = os.getenv("ADMIN_PRIVATE_KEY")
if ADMIN_PRIVATE_KEY:
    ADMIN_ADDRESS = w3.eth.account.from_key(ADMIN_PRIVATE_KEY).address
else:
    ADMIN_ADDRESS = None

# Contract Addresses loaded from environment variables
TEST_TOKEN_ADDRESS = os.getenv("TEST_TOKEN_ADDRESS", "0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d")
ROLES_ADDRESS = os.getenv("ROLES_ADDRESS", "0x06d95F59142eAA3c5f06757c43F6C4db54b73c16")
GRADE_REGISTRY_ADDRESS = os.getenv("GRADE_REGISTRY_ADDRESS", "0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C")
ESCROW_MANAGER_ADDRESS = os.getenv("ESCROW_MANAGER_ADDRESS", "0xB0cA0E341006238BcCCc46cd7Bebd25297794860")
DISPUTE_ARBITER_ADDRESS = os.getenv("DISPUTE_ARBITER_ADDRESS", "0xfa56743872bc0457C3667609677EE0877d340E5e")

def load_contract(name, address):
    """
    Loads contract ABI and creates a web3 contract instance.
    """
    # Load ABI relative to backend workspace root
    abi_path = os.path.join(os.path.dirname(__file__), "..", "core", "abis", f"{name}.json")
    if not os.path.exists(abi_path):
        return None
    with open(abi_path) as f:
        abi = json.load(f)["abi"]
    return w3.eth.contract(address=address, abi=abi)

# Instantiate all 5 deployed contracts
test_token = load_contract("TestToken", TEST_TOKEN_ADDRESS)
roles = load_contract("Roles", ROLES_ADDRESS)
grade_registry = load_contract("GradeRegistry", GRADE_REGISTRY_ADDRESS)
escrow_manager = load_contract("EscrowManager", ESCROW_MANAGER_ADDRESS)
dispute_arbiter = load_contract("DisputeArbiter", DISPUTE_ARBITER_ADDRESS)

def get_escrow_contract():
    """
    Exposes the EscrowManager contract instance.
    """
    return escrow_manager

def submit_grade(lot_id_bytes, grade_idx: int, sha256_hash_bytes, sender_address=ADMIN_ADDRESS):
    """
    Signs and broadcasts a grade submission on-chain using the admin hot wallet.
    """
    if not ADMIN_PRIVATE_KEY:
        raise ValueError("ADMIN_PRIVATE_KEY environment variable is not configured.")

    nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
    
    # Contract method signature: submitGrade(bytes32 lotId, uint8 grade, bytes32 sha256Hash)
    tx = grade_registry.functions.submitGrade(
        lot_id_bytes,
        grade_idx,
        sha256_hash_bytes
    ).build_transaction({
        "chainId": 80002,  # Polygon Amoy
        "gas": 300000,
        "gasPrice": w3.to_wei(30, "gwei"),
        "nonce": nonce,
    })
    
    signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    return w3.to_hex(tx_hash)