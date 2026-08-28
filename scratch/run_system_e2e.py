import os
import sys
import time
from web3 import Web3
from eth_account import Account

# Add backend folder to sys path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")

from backend.app.services.chain_client import (
    w3, grade_registry, escrow_manager, test_token, ADMIN_ADDRESS, ADMIN_PRIVATE_KEY
)
from backend.app.services.weighbridge import WAREHOUSE_PRIVATE_KEY, WAREHOUSE_ADDRESS

def run_e2e_step(order_id_num: int):
    order_id_str = f"ORDER-{order_id_num}"
    lot_id_str = f"LOT-{order_id_num}"
    
    order_id_bytes = Web3.keccak(text=order_id_str)
    lot_id_bytes = Web3.keccak(text=lot_id_str)
    
    print("=" * 80)
    print(f"STARTING BLOCKCHAIN RELAYER ACTIONS FOR ORDER: {order_id_str}")
    print("=" * 80)
    
    # --- STEP 1: Submit Grade via Admin Key ---
    print("\n[Step 1/2] Anchoring AI Grade Report on-chain...")
    grade_idx = 0  # Grade A
    sha256_hash = Web3.keccak(text=f"report-hash-for-{lot_id_str}")
    
    try:
        # Check if already graded
        grade_record = grade_registry.functions.grades(lot_id_bytes).call()
        if grade_record[4]:  # exists
            print("[SUCCESS] Lot " + lot_id_str + " is already graded on-chain.")
        else:
            nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
            tx = grade_registry.functions.submitGrade(
                lot_id_bytes,
                grade_idx,
                sha256_hash
            ).build_transaction({
                "chainId": 80002,
                "gas": 300000,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            })
            signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
            print(f"Transaction broadcasted! Hash: {tx_hash.hex()}")
            print("Waiting for block confirmation (~2-4 seconds)...")
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            if receipt.status == 1:
                print(f"[SUCCESS] Grade anchored. Gas used: {receipt.gasUsed}")
            else:
                print("Error: Grade submission transaction reverted.")
                return
    except Exception as e:
        print(f"Error submitting grade: {e}")
        return

    # --- STEP 2: Verify Order Escrow Status & Confirm Delivery ---
    print("\n[Step 2/2] Checking order state on EscrowManager...")
    try:
        order_info = escrow_manager.functions.getOrder(order_id_bytes).call()
        # State: 0 = Created, 1 = PickedUp, 2 = Delivered, 3 = Settled, 4 = Disputed
        state = order_info[9]
        print(f"Current Order State: {state}")
        
        if state == 0:  # Created
            print("Order is locked in 'Created' state. Transporter needs to mark as picked up.")
            print("Please run the logistics pick-up confirmation or wait.")
        elif state == 1:  # PickedUp
            print("Order is in 'PickedUp' state. Confirming delivery via Warehouse Hot Wallet...")
            weighbridge_reading = 980 # 980 kg
            nonce = w3.eth.get_transaction_count(WAREHOUSE_ADDRESS)
            tx = escrow_manager.functions.confirmDelivery(
                order_id_bytes,
                weighbridge_reading
            ).build_transaction({
                "chainId": 80002,
                "gas": 300000,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            })
            signed = w3.eth.account.sign_transaction(tx, WAREHOUSE_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
            print(f"Transaction broadcasted! Hash: {tx_hash.hex()}")
            print("Waiting for block confirmation...")
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            if receipt.status == 1:
                print(f"[SUCCESS] Delivery confirmed and payouts disbursed. Gas used: {receipt.gasUsed}")
            else:
                print("Error: Delivery confirmation transaction reverted.")
        elif state == 3:  # Settled
            print("[SUCCESS] Order is already Settled on-chain.")
        else:
            print(f"Order state is {state}. Cannot perform delivery confirmation in this state.")
            
    except Exception as e:
        print(f"Error checking order or confirming delivery: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--order", type=int, default=101, help="Order ID number to process")
    args = parser.parse_args()
    run_e2e_step(args.order)
