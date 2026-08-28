import asyncio
from web3 import Web3
from web3.exceptions import LogTopicError
from app.services.chain_client import get_escrow_contract, w3

def process_event(event):
    """
    Parses the blockchain event and updates the PostgreSQL database.
    """
    event_name = event.event
    args = event.args
    
    # orderId is stored as bytes32 on-chain, convert back to hex or string
    order_id_raw = getattr(args, 'orderId', b'')
    order_id = order_id_raw.hex() if isinstance(order_id_raw, bytes) else order_id_raw
    
    print(f"\n🔗 [BLOCKCHAIN EVENT CAUGHT] {event_name}")
    print(f"Order ID: {order_id}")
    
    # TODO: Integrate with backend/app/db/session.py to update PostgreSQL
    if event_name == "OrderCreated":
        print(f"Action: Escrow locked {args.totalLocked} wei for Farmer {args.farmer}")
        # db.execute("UPDATE crop_lots SET status='ESCROW_LOCKED' WHERE id=...", )
        
    elif event_name == "AdvanceReleased":
        print(f"Action: 30% Freight Advance ({args.amount} wei) released to Logistics {args.logistics}")
        # db.execute("UPDATE orders SET transit_status='IN_TRANSIT' WHERE ...")
        
    elif event_name == "DeliveryConfirmed":
        print(f"Action: Weighbridge reading {args.weighbridgeReading} recorded. Settlement initiated.")
        # db.execute("UPDATE orders SET transit_status='DELIVERED' WHERE ...")
        
    elif event_name == "OrderSettled":
        print("Action: Order completely settled. 100% DBT executed.")
        # db.execute("UPDATE orders SET financial_status='SETTLED' WHERE ...")

async def listen_for_events(poll_interval=2):
    """
    Asynchronous loop that polls the local Anvil node for new Escrow events[cite: 2].
    """
    escrow = get_escrow_contract()
    
    print("🎧 Starting Blockchain Event Listener on EscrowManager...")
    
    # Create filters starting from the latest block
    try:
        # Note: web3.py creates filters that persist on the node
        event_filter = escrow.events.OrderCreated.create_filter(fromBlock='latest')
        advance_filter = escrow.events.AdvanceReleased.create_filter(fromBlock='latest')
        delivery_filter = escrow.events.DeliveryConfirmed.create_filter(fromBlock='latest')
        settled_filter = escrow.events.OrderSettled.create_filter(fromBlock='latest')
        
        filters = [event_filter, advance_filter, delivery_filter, settled_filter]
        
        while True:
            for f in filters:
                for event in f.get_new_entries():
                    process_event(event)
            await asyncio.sleep(poll_interval)
            
    except Exception as e:
        print(f"Event Listener Error: {e}")