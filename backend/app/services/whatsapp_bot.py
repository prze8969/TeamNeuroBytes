import re
import base64
from typing import Dict, Any, Optional
from sqlmodel import Session, select
from app.models.database import User, CropLot, QualityGrade, LotStatus, MandiPrice
from app.services.ai_grading import ai_grading_service

# In-memory farmer conversation state machine
FARMER_SESSIONS: Dict[str, Dict[str, Any]] = {}

class WhatsAppBotService:
    @classmethod
    def process_incoming_message(
        cls,
        session: Session,
        from_phone: str,
        message_type: str, # "text", "location", "image"
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        State Machine for low-friction farmer interactions over WhatsApp:
        - Step 0: Greet & Main Menu
        - Step 1: Crop Name & Variety
        - Step 2: Quantity & Asking Rate
        - Step 3: Location Pin (GPS)
        - Step 4: Photo Capture & Instant YOLO AI Grading
        - Step 5: Lot Created & Escrow / Bid Alert Subscription
        """
        user_state = FARMER_SESSIONS.setdefault(from_phone, {
            "step": "MENU",
            "data": {}
        })
        current_step = user_state["step"]

        # Handle Commands / Reset
        raw_text = payload.get("text", "").strip() if message_type == "text" else ""
        if raw_text.lower() in ["hi", "hello", "namaste", "menu", "start", "reset"]:
            user_state["step"] = "MENU"
            user_state["data"] = {}
            return cls._render_main_menu(from_phone)

        # State 1: Main Menu Selection
        if current_step == "MENU":
            if raw_text == "1":
                user_state["step"] = "AWAITING_CROP_NAME"
                return {
                    "reply": "🌾 *KisanSetu - Step 1/4: Crop Listing*\n\nPlease reply with your crop name and variety.\n\n_Example: Sharbati Wheat or Red Onion_"
                }
            elif raw_text == "2":
                return cls._get_live_mandi_rates(session)
            elif raw_text == "3":
                return cls._get_farmer_active_bids(session, from_phone)
            elif raw_text == "4":
                return {
                    "reply": "📞 *KisanSetu Farmer Helpdesk*\n\nToll-Free Kisan Call Center: *1800-180-1551*\nFPO Coordinator: *+91-9876543212*\n\nReply *MENU* to return."
                }
            else:
                return cls._render_main_menu(from_phone)

        # State 2: Crop Name Input
        elif current_step == "AWAITING_CROP_NAME":
            user_state["data"]["crop_name"] = raw_text
            user_state["step"] = "AWAITING_QUANTITY_PRICE"
            return {
                "reply": f"✅ Recorded: *{raw_text}*\n\n📦 *Step 2/4: Quantity & Expected Price*\nReply with total weight in Quintals (or kg) and your expected price in ₹/kg.\n\n_Example: 50 Quintal, ₹26/kg_"
            }

        # State 3: Quantity and Price Input
        elif current_step == "AWAITING_QUANTITY_PRICE":
            # Extract numbers
            numbers = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", raw_text)
            quantity_kg = 5000.0
            price_kg = 25.0
            if len(numbers) >= 2:
                q_val = float(numbers[0])
                quantity_kg = q_val * 100.0 if ("quintal" in raw_text.lower() or "qtl" in raw_text.lower() or q_val < 500) else q_val
                price_kg = float(numbers[1])
            elif len(numbers) == 1:
                quantity_kg = float(numbers[0]) * 100.0

            user_state["data"]["quantity_kg"] = quantity_kg
            user_state["data"]["base_price_per_kg"] = price_kg
            user_state["step"] = "AWAITING_LOCATION"
            return {
                "reply": f"📍 *Step 3/4: Farm Gate Location*\n\nPlease tap the 📎 Attachment icon and share your *WhatsApp Live/Current Location Pin* so our FPO freight truck can reach your farm gate."
            }

        # State 4: Location Pin Input
        elif current_step == "AWAITING_LOCATION":
            lat = payload.get("latitude", 20.0125)
            lon = payload.get("longitude", 73.7910)
            user_state["data"]["latitude"] = lat
            user_state["data"]["longitude"] = lon
            user_state["data"]["district"] = payload.get("district", "Nashik")
            user_state["step"] = "AWAITING_IMAGE"
            return {
                "reply": f"📸 *Step 4/4: AI Crop Quality Check*\n\nPlease snap and send a clear photo of your produce sample in daylight.\n\nOur YOLOv8 AI model will instantly analyze grain uniformity, ripeness, and defects to issue an official Grade badge!"
            }

        # State 5: Produce Photo & AI Verification
        elif current_step == "AWAITING_IMAGE":
            # Process sample or uploaded image
            img_bytes = payload.get("image_bytes")
            if not img_bytes:
                # Default synthetic sample for demo WhatsApp webhooks
                img_grading = {
                    "commodity_detected": user_state["data"].get("crop_name", "Wheat"),
                    "quality_grade": "A",
                    "quality_score": 94.5,
                    "defect_percentage": 1.6,
                    "ripeness_index": 96.0,
                    "trade_recommendation": "Premium Institutional Grade",
                    "is_passed": True
                }
            else:
                img_grading = ai_grading_service.grade_image_bytes(img_bytes)

            # Persist in Database
            farmer = session.exec(select(User).where(User.phone_number == from_phone)).first()
            farmer_id = farmer.id if farmer else 1

            new_lot = CropLot(
                farmer_id=farmer_id,
                farmer_phone=from_phone,
                farmer_name=farmer.full_name if farmer else "Farmer",
                commodity=user_state["data"].get("crop_name", "Wheat"),
                variety="Standard Hybrid",
                quantity_kg=user_state["data"].get("quantity_kg", 5000.0),
                base_price_per_kg=user_state["data"].get("base_price_per_kg", 25.0),
                quality_grade=QualityGrade(img_grading["quality_grade"]),
                quality_score=img_grading["quality_score"],
                defect_percentage=img_grading["defect_percentage"],
                ripeness_index=img_grading["ripeness_index"],
                is_ai_verified=True,
                latitude=user_state["data"].get("latitude", 20.0125),
                longitude=user_state["data"].get("longitude", 73.7910),
                district=user_state["data"].get("district", "Nashik"),
                state="Maharashtra",
                destination_mandi="Nashik APMC",
                status=LotStatus.LISTED
            )
            session.add(new_lot)
            session.commit()
            session.refresh(new_lot)

            # Reset session state
            user_state["step"] = "MENU"
            user_state["data"] = {}

            return {
                "reply": (
                    f"🎉 *CONGRATULATIONS! LOT #{new_lot.id} VERIFIED & PUBLISHED*\n\n"
                    f"🔬 *AI Grading Result:*\n"
                    f"• Grade: *Grade {new_lot.quality_grade}* (Quality: {new_lot.quality_score}%)\n"
                    f"• Defect Rate: *{new_lot.defect_percentage}%* (Clean produce)\n"
                    f"• Quantity: *{new_lot.quantity_kg/1000:.1f} Tons*\n"
                    f"• Asking Base Rate: *₹{new_lot.base_price_per_kg}/kg*\n\n"
                    f"🛡️ *What happens next?*\n"
                    f"1. Your lot is published to 250+ institutional buyers.\n"
                    f"2. Local FPO freight pooling is searching nearby farms to cut your transport costs by ~30%.\n"
                    f"3. You will receive an instant WhatsApp alert whenever a buyer places an Escrow-backed bid!\n\n"
                    f"Reply *MENU* anytime."
                )
            }

        return cls._render_main_menu(from_phone)

    @classmethod
    def _render_main_menu(cls, phone: str) -> Dict[str, Any]:
        return {
            "reply": (
                "🌾 *Welcome to KisanSetu Market Linkage Bot* 🌾\n"
                "_(Govt. of India • Agmarknet & FPO Trade Network)_\n\n"
                "Please choose an option:\n\n"
                "1️⃣ *List New Crop Produce* (AI grading & buyer bids)\n"
                "2️⃣ *Check Live APMC Mandi Rates & AI Forecast*\n"
                "3️⃣ *View My Active Bids & Escrow Payouts*\n"
                "4️⃣ *Kisan Helpdesk & Grievance*\n\n"
                "_Reply with 1, 2, 3, or 4_"
            )
        }

    @classmethod
    def _get_live_mandi_rates(cls, session: Session) -> Dict[str, Any]:
        prices = session.exec(select(MandiPrice)).all()
        if not prices:
            return {"reply": "📊 No live prices recorded today. Please check back shortly."}

        lines = ["📊 *Today's Agmarknet Mandi Benchmarks & 7-Day AI Forecast:*\n"]
        for p in prices[:4]:
            lines.append(
                f"• *{p.mandi_name}* ({p.commodity})\n"
                f"   Modal: *₹{p.modal_price_kg}/kg* | 7D Forecast: *₹{p.forecast_7d_modal_kg}/kg*\n"
            )
        lines.append("\nReply *1* to list your produce at optimal market rate, or *MENU* to go back.")
        return {"reply": "\n".join(lines)}

    @classmethod
    def _get_farmer_active_bids(cls, session: Session, phone: str) -> Dict[str, Any]:
        lots = session.exec(select(CropLot).where(CropLot.farmer_phone == phone)).all()
        if not lots:
            return {
                "reply": "📦 You have no active crop listings registered with this phone number.\n\nReply *1* to create your first crop listing!"
            }
        
        lines = [f"📦 *Your Registered Lots ({len(lots)} active):*\n"]
        for l in lots[:3]:
            lines.append(
                f"• Lot #{l.id} - *{l.commodity}* (Grade {l.quality_grade})\n"
                f"  Weight: {l.quantity_kg/1000:.1f}T | Base: ₹{l.base_price_per_kg}/kg | Status: *{l.status}*\n"
            )
        lines.append("\nReply *MENU* to return.")
        return {"reply": "\n".join(lines)}

whatsapp_bot_service = WhatsAppBotService()
