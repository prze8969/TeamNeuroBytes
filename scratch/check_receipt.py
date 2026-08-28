import os
import sys
from web3 import Web3

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from dotenv import load_dotenv
load_dotenv(dotenv_path="backend/.env")

from backend.app.services.chain_client import w3
from backend.app.services.weighbridge import WAREHOUSE_ADDRESS, WAREHOUSE_PRIVATE_KEY

def check_receipt(tx_hash_hex):
    print(f"Querying receipt for {tx_hash_hex}...")
    receipt = w3.eth.get_transaction_receipt(tx_hash_hex)
    tx = w3.eth.get_transaction(tx_hash_hex)
    print(f"Status: {receipt.status} (1 = Success)")
    print(f"From: {tx['from']}")
    print(f"To: {tx['to']}")
    print(f"Value: {w3.from_wei(tx['value'], 'ether')} POL")
    print(f"Derived Warehouse Address: {WAREHOUSE_ADDRESS}")
    print(f"Derived Warehouse Key: {WAREHOUSE_PRIVATE_KEY}")
    print(f"Derived Warehouse Balance: {w3.from_wei(w3.eth.get_balance(WAREHOUSE_ADDRESS), 'ether')} POL")

if __name__ == "__main__":
    check_receipt("0x47af6471140bd9ca3f79a922cb095ba6d8e8a08bd7fe55c87f37409015fc966b")
