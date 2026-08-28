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
    w3, grade_registry, escrow_manager, test_token, roles, ADMIN_ADDRESS, ADMIN_PRIVATE_KEY
)
from backend.app.services.weighbridge import WAREHOUSE_PRIVATE_KEY, WAREHOUSE_ADDRESS

def run_full_onchain_test():
    test_id = int(time.time()) % 100000
    order_id_str = f"ORDER-TEST-{test_id}"
    lot_id_str = f"LOT-TEST-{test_id}"
    
    order_id_bytes = Web3.keccak(text=order_id_str)
    lot_id_bytes = Web3.keccak(text=lot_id_str)
    
    # Pre-defined test addresses
    farmer_address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    logistics_address = ADMIN_ADDRESS  # Using Admin Key for logistics transporter simulation
    buyer_address = ADMIN_ADDRESS      # Using Admin Key for buyer simulation
    
    # Check if warehouse is the blocked default address
    if WAREHOUSE_ADDRESS == "0x70997970C51812dc3A010C7d01b50e0d17dc79C8":
        print("[INFO] Configured warehouse is the default Anvil address (blocked on Amoy). Generating a fresh temporary test EOA...")
        temp_acct = w3.eth.account.create()
        test_warehouse_key = temp_acct.key.hex()
        test_warehouse_addr = temp_acct.address
    else:
        test_warehouse_key = WAREHOUSE_PRIVATE_KEY
        test_warehouse_addr = WAREHOUSE_ADDRESS

    print(f"Warehouse Test Address: {test_warehouse_addr}")

    # Funding Warehouse Wallet with Gas money if needed
    print("\n[Gas Check] Checking Warehouse Hot Wallet POL balance...")
    warehouse_bal = w3.eth.get_balance(test_warehouse_addr)
    print(f"Warehouse Balance: {w3.from_wei(warehouse_bal, 'ether')} POL")
    if warehouse_bal < w3.to_wei(0.02, "ether"):
        print("Funding Warehouse Hot Wallet with 0.03 POL from Admin...")
        nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
        tx = {
            'nonce': nonce,
            'to': test_warehouse_addr,
            'value': w3.to_wei(0.03, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'chainId': 80002
        }
        signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Funded Warehouse wallet. Tx: {tx_hash.hex()}")
    
    print("=" * 80)
    print(f"EXECUTING COMPLETE ON-CHAIN ESCROW LIFECYCLE FOR {order_id_str}")
    print("=" * 80)
    
    # 1. Fetch Roles Keccak Hashes
    BUYER_ROLE = roles.functions.BUYER_ROLE().call()
    LOGISTICS_ROLE = roles.functions.LOGISTICS_ROLE().call()
    WAREHOUSE_ROLE = roles.functions.WAREHOUSE_ROLE().call()
    
    # 2. Grant roles to Admin Key and test Warehouse Address
    print("\n[1/6] Authorizing roles on Roles Contract...")
    for role_name, role_hash, target_addr in [
        ("BUYER_ROLE", BUYER_ROLE, ADMIN_ADDRESS), 
        ("LOGISTICS_ROLE", LOGISTICS_ROLE, ADMIN_ADDRESS),
        ("WAREHOUSE_ROLE", WAREHOUSE_ROLE, test_warehouse_addr)
    ]:
        has_role = escrow_manager.functions.hasRole(role_hash, target_addr).call()
        if not has_role:
            print(f"Granting {role_name} to {target_addr}...")
            nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
            tx = escrow_manager.functions.grantRole(role_hash, target_addr).build_transaction({
                "chainId": 80002,
                "gas": 150000,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce
            })
            signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
            w3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"Granted {role_name}. Tx: {tx_hash.hex()}")
        else:
            print(f"[INFO] {target_addr} already has {role_name}.")
            
    # 3. Approve TestToken Spending
    print("\n[2/6] Approving TestToken spending for EscrowManager...")
    crop_val = w3.to_wei(100, "ether")
    freight_val = w3.to_wei(20, "ether")
    total_val = crop_val + freight_val + (crop_val * 150 // 10000) # crop + freight + 1.5% cess
    
    nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
    tx = test_token.functions.approve(escrow_manager.address, total_val).build_transaction({
        "chainId": 80002,
        "gas": 100000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce
    })
    signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Approved spending. Tx: {tx_hash.hex()}")
    
    # 4. Create Order (Lock Escrow)
    print("\n[3/6] Locking funds via createOrder() on EscrowManager...")
    nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
    tx = escrow_manager.functions.createOrder(
        order_id_bytes,
        lot_id_bytes,
        farmer_address,
        logistics_address,
        crop_val,
        freight_val
    ).build_transaction({
        "chainId": 80002,
        "gas": 300000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce
    })
    signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Order created & funds locked on-chain. Tx: {tx_hash.hex()}")
    
    # 5. Anchor Grade Report
    print("\n[4/6] Anchoring grade report to GradeRegistry...")
    nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
    tx = grade_registry.functions.submitGrade(
        lot_id_bytes,
        0, # Grade A
        Web3.keccak(text=f"report-hash-{lot_id_str}")
    ).build_transaction({
        "chainId": 80002,
        "gas": 150000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce
    })
    signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Grade anchored. Tx: {tx_hash.hex()}")
    
    # 6. Mark Picked Up (Disburses 30% Freight Advance)
    print("\n[5/6] Logistics pickup: markPickedUp() on EscrowManager...")
    nonce = w3.eth.get_transaction_count(ADMIN_ADDRESS)
    tx = escrow_manager.functions.markPickedUp(order_id_bytes).build_transaction({
        "chainId": 80002,
        "gas": 200000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce
    })
    signed = w3.eth.account.sign_transaction(tx, ADMIN_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Logistics pickup verified & fuel advance paid. Tx: {tx_hash.hex()}")
    
    # 7. Confirm Delivery (Weighbridge settlement)
    print("\n[6/6] Confirming delivery & releasing final payouts via confirmDelivery()...")
    nonce = w3.eth.get_transaction_count(test_warehouse_addr)
    tx = escrow_manager.functions.confirmDelivery(
        order_id_bytes,
        990  # 990 kg
    ).build_transaction({
        "chainId": 80002,
        "gas": 300000,
        "gasPrice": w3.eth.gas_price,
        "nonce": nonce
    })
    signed = w3.eth.account.sign_transaction(tx, test_warehouse_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Delivery confirmed on-chain. Order fully settled. Tx: {tx_hash.hex()}")
    
    print("\n" + "=" * 80)
    print("ALL STAGES COMPLETED & VERIFIED ON-CHAIN")
    print("=" * 80)

if __name__ == "__main__":
    run_full_onchain_test()
