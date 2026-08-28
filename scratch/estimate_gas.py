import os
import sys
from web3 import Web3
from eth_account import Account

# Add backend folder to sys path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")

from backend.app.services.chain_client import w3, grade_registry, escrow_manager, ADMIN_ADDRESS

def estimate_all_gas():
    print("=" * 80)
    print("ESTIMATING GAS FOR RELAYER TRANSACTIONS ON POLYGON AMOY")
    print("=" * 80)
    
    # 1. submitGrade Estimate on GradeRegistry
    try:
        # Dummy inputs for estimation
        lot_id = Web3.keccak(text="lot-test-123")
        grade = 0 # Grade.A
        sha256_hash = Web3.keccak(text="hash-test-123")
        
        # Build transaction dict without sending
        gas_estimate_grade = grade_registry.functions.submitGrade(
            lot_id,
            grade,
            sha256_hash
        ).estimate_gas({
            "from": ADMIN_ADDRESS
        })
        
        print(f"submitGrade Gas Estimate: {gas_estimate_grade} units")
    except Exception as e:
        print(f"submitGrade Gas Estimation failed (probably due to missing role or already graded lot): {e}")

    # 2. confirmDelivery Estimate on EscrowManager
    try:
        order_id = Web3.keccak(text="order-test-123")
        reading = 1000
        
        # Warehouse Hot Wallet address (standard role holder)
        warehouse_address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
        
        gas_estimate_delivery = escrow_manager.functions.confirmDelivery(
            order_id,
            reading
        ).estimate_gas({
            "from": warehouse_address
        })
        print(f"confirmDelivery Gas Estimate: {gas_estimate_delivery} units")
    except Exception as e:
        print(f"confirmDelivery Gas Estimation failed (likely due to invalid order state): {e}")

if __name__ == "__main__":
    estimate_all_gas()
