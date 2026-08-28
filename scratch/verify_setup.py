import os
import sys
from web3 import Web3
import json

# Add backend folder to sys path so we can import services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load backend/.env manually for python-dotenv simulation
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")

from backend.app.services.chain_client import w3, test_token, roles, grade_registry, escrow_manager, dispute_arbiter, ADMIN_ADDRESS

def verify_contracts():
    print("=" * 80)
    print("RUNNING READ-ONLY SANITY CHECKS ON POLYGON AMOY DEPLOYMENTS")
    print("=" * 80)
    
    # 1. Web3 Connection
    connected = w3.is_connected()
    print(f"Web3 Connected: {connected}")
    if not connected:
        print("Error: Web3 is not connected to the Amoy RPC URL.")
        return
        
    print(f"Admin Address: {ADMIN_ADDRESS}")
    
    # 2. TestToken Checks
    try:
        symbol = test_token.functions.symbol().call()
        decimals = test_token.functions.decimals().call()
        print(f"TestToken: Deployed successfully. Symbol={symbol}, Decimals={decimals}")
    except Exception as e:
        print(f"TestToken Read Error: {e}")
        
    # 3. Roles Constants & Checks
    try:
        # Get roles constants
        PRODUCER_ROLE = roles.functions.PRODUCER_ROLE().call()
        BUYER_ROLE = roles.functions.BUYER_ROLE().call()
        WAREHOUSE_ROLE = roles.functions.WAREHOUSE_ROLE().call()
        REGULATOR_ROLE = roles.functions.REGULATOR_ROLE().call()
        
        print("\nRoles Constants (keccak256):")
        print(f"  PRODUCER_ROLE:  {PRODUCER_ROLE.hex()}")
        print(f"  BUYER_ROLE:     {BUYER_ROLE.hex()}")
        print(f"  WAREHOUSE_ROLE: {WAREHOUSE_ROLE.hex()}")
        print(f"  REGULATOR_ROLE: {REGULATOR_ROLE.hex()}")
        
        # Check if Admin Address has PRODUCER_ROLE (required for submitGrade in GradeRegistry)
        has_producer = grade_registry.functions.hasRole(PRODUCER_ROLE, ADMIN_ADDRESS).call() if ADMIN_ADDRESS else False
        print(f"\nAdmin has PRODUCER_ROLE on GradeRegistry: {has_producer}")
        
    except Exception as e:
        print(f"Roles Read Error: {e}")
        
    # 4. Verify event filters setup can compile
    try:
        print("\nVerifying Event listener filter compilation...")
        event_filter = escrow_manager.events.OrderCreated.create_filter(from_block="latest")
        print("✓ OrderCreated filter compiles and creates successfully.")
    except Exception as e:
        print(f"OrderCreated filter creation error: {e}")

if __name__ == "__main__":
    verify_contracts()
