from fastapi import APIRouter, Depends, Query, Request, Response, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlmodel import Session

from app.db.engine import get_session
from app.core.config import settings
from app.services.whatsapp_bot import whatsapp_bot_service

router = APIRouter()

class SimulatedWhatsAppMessage(BaseModel):
    from_phone: str = "+919876543210"
    message_type: str = "text" # "text", "location", "image"
    text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = "Nashik"
    image_base64: Optional[str] = None

@router.get("/webhook")
def verify_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge")
):
    """
    WhatsApp Cloud API Webhook Verification Endpoint (GET).
    Validates token configured in Meta Business Developer Console.
    """
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        return Response(content=hub_challenge or "1234567890", media_type="text/plain")
    
    # Allow loose dev testing verification
    if hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN or not hub_verify_token:
        return Response(content=hub_challenge or "OK", media_type="text/plain")
        
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Invalid WhatsApp verification token"
    )

@router.post("/webhook")
async def receive_whatsapp_event(request: Request, session: Session = Depends(get_session)):
    """
    WhatsApp Cloud API Webhook Event Receiver (POST).
    Parses standard Meta payload and routes to state machine.
    """
    try:
        body = await request.json()
        entry = body.get("entry", [{}])[0]
        changes = entry.get("changes", [{}])[0]
        value = changes.get("value", {})
        messages = value.get("messages", [])

        if not messages:
            return {"status": "NO_MESSAGES_IN_PAYLOAD"}

        message = messages[0]
        from_phone = message.get("from")
        msg_type = message.get("type", "text")

        payload: Dict[str, Any] = {}
        if msg_type == "text":
            payload["text"] = message.get("text", {}).get("body", "")
        elif msg_type == "location":
            loc = message.get("location", {})
            payload["latitude"] = loc.get("latitude")
            payload["longitude"] = loc.get("longitude")
        elif msg_type == "image":
            # Real Cloud API requires media ID lookup; fallback for simulation
            payload["image_bytes"] = None

        result = whatsapp_bot_service.process_incoming_message(
            session=session,
            from_phone=f"+{from_phone}" if not str(from_phone).startswith("+") else str(from_phone),
            message_type=msg_type,
            payload=payload
        )
        return {"status": "SUCCESS", "bot_response": result}
    except Exception as e:
        return {"status": "ERROR", "detail": str(e)}

@router.post("/simulate")
def simulate_whatsapp_interaction(
    sim_msg: SimulatedWhatsAppMessage,
    session: Session = Depends(get_session)
):
    """
    Interactive test endpoint for the Web UI and SIH judges to test
    farmer WhatsApp conversations directly from browser/Postman.
    """
    payload = {
        "text": sim_msg.text,
        "latitude": sim_msg.latitude,
        "longitude": sim_msg.longitude,
        "district": sim_msg.district
    }
    
    if sim_msg.image_base64:
        import base64
        try:
            raw_b64 = sim_msg.image_base64
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",")[1]
            payload["image_bytes"] = base64.b64decode(raw_b64)
        except Exception:
            payload["image_bytes"] = None

    response = whatsapp_bot_service.process_incoming_message(
        session=session,
        from_phone=sim_msg.from_phone,
        message_type=sim_msg.message_type,
        payload=payload
    )
    return response
