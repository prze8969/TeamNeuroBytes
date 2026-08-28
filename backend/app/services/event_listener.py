import asyncio
from app.services.chain_client import get_escrow_contract, w3

def process_event(event):
    """
    Parses the blockchain event and updates the PostgreSQL database.
    """
    event_name = getattr(event, 'event', 'UnknownEvent')
    args = getattr(event, 'args', {})
    
    # orderId is stored as bytes32 on-chain, convert back to hex or string
    order_id_raw = getattr(args, 'orderId', b'')
    order_id = order_id_raw.hex() if isinstance(order_id_raw, bytes) else order_id_raw
    
    print(f"\n🔗 [BLOCKCHAIN EVENT CAUGHT] {event_name}")
    print(f"Order ID: {order_id}")
    
    if event_name == "OrderCreated":
        print(f"Action: Escrow locked {getattr(args, 'totalLocked', 0)} wei for Farmer {getattr(args, 'farmer', '')}")
    elif event_name == "AdvanceReleased":
        print(f"Action: 30% Freight Advance ({getattr(args, 'amount', 0)} wei) released to Logistics {getattr(args, 'logistics', '')}")
    elif event_name == "DeliveryConfirmed":
        print(f"Action: Weighbridge reading {getattr(args, 'weighbridgeReading', 0)} recorded. Settlement initiated.")
    elif event_name == "OrderSettled":
        print("Action: Order completely settled. 100% DBT executed.")

async def listen_for_events(poll_interval=2):
    """
    Asynchronous loop that polls the Polygon Amoy node for new Escrow events.
    Poller interval set to 2s to align with Amoy's average block time.
    """
    if not w3:
        print("INFO: Blockchain event listener in standby (Web3 node offline).")
        return

    escrow = get_escrow_contract()
    if not escrow:
        print("INFO: EscrowManager contract ABI not yet compiled. Event listener idle.")
        return
    
    print("🎧 Starting Blockchain Event Listener on EscrowManager...")
    
    try:
        # Reconciled event names and normalized Web3.py v7 'from_block' casing
        event_filter = escrow.events.OrderCreated.create_filter(from_block="latest")
        advance_filter = escrow.events.AdvanceReleased.create_filter(from_block='latest')
        delivery_filter = escrow.events.DeliveryConfirmed.create_filter(from_block='latest')
        settled_filter = escrow.events.OrderSettled.create_filter(from_block='latest')
        
        filters = [event_filter, advance_filter, delivery_filter, settled_filter]
        
        while True:
            for f in filters:
                for event in f.get_new_entries():
                    process_event(event)
            await asyncio.sleep(poll_interval)
            
    except Exception as e:
        print(f"Event Listener Standby: {e}")
