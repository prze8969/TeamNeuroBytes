import os

try:
    from web3 import Web3
    from .chain_client import w3, get_escrow_contract
    WAREHOUSE_PRIVATE_KEY = os.getenv(
        "WAREHOUSE_PRIVATE_KEY", 
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
    )
    WAREHOUSE_ADDRESS = w3.eth.account.from_key(WAREHOUSE_PRIVATE_KEY).address if w3 and hasattr(w3, 'eth') else "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
except Exception:
    w3 = None
    Web3 = None
    WAREHOUSE_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

def confirm_delivery_on_chain(order_id_str: str, weighbridge_reading: int):
    """
    Acts as the trusted relayer for physical warehouse sensors.
    Signs and submits the confirmDelivery transaction to the EscrowManager.
    """
    if not w3 or not Web3:
        return "0x_mock_tx_hash_blockchain_simulation"

    escrow = get_escrow_contract()
    if not escrow:
        return "0x_mock_tx_hash_contract_simulation"
    
    # Convert string order_id to bytes32 (assuming it's a plain string like "ORDER-123")
    order_id_bytes = Web3.keccak(text=order_id_str)

    # 1. Get the current nonce for the hot wallet
    nonce = w3.eth.get_transaction_count(WAREHOUSE_ADDRESS)
    
    # 2. Build the transaction
    print(f"Building transaction to confirm delivery for order {order_id_str}...")
    txn = escrow.functions.confirmDelivery(
        order_id_bytes, 
        weighbridge_reading
    ).build_transaction({
        'from': WAREHOUSE_ADDRESS,
        'nonce': nonce,
        'gas': 300000,
        'gasPrice': w3.eth.gas_price
    })

    # 3. Sign the transaction with the hot wallet's private key
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=WAREHOUSE_PRIVATE_KEY)
    
    # 4. Broadcast to the network
    print("Broadcasting transaction to Polygon Amoy (Local Anvil)...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    # 5. Wait for the block to be mined
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    if receipt.status == 1:
        print(f"SUCCESS: Delivery confirmed on-chain! Tx Hash: {tx_hash.hex()}")
        return tx_hash.hex()
    else:
        raise Exception(f"Transaction failed! Tx Hash: {tx_hash.hex()}")