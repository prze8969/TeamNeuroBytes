import io
import base64
import hashlib
import unittest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _make_b64(color=(255, 0, 0)) -> str:
    img = Image.new("RGB", (100, 100), color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def _make_bytes(color=(255, 0, 0)) -> bytes:
    img = Image.new("RGB", (100, 100), color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


# Base payload — all required classification fields included and confirmed
def _base_payload(image_url: str, **overrides) -> dict:
    payload = {
        "farmer_id": 1,
        "farmer_name": "Ramesh Patil",
        "commodity": "Wheat",
        "commodity_category": "Cereals",
        "variety": "Sharbati Lok-1",
        "farmer_confirmed_classification": True,
        "quantity_kg": 100.0,
        "base_price_per_kg": 25.0,
        "district": "Nashik",
        "state": "Maharashtra",
        "latitude": 20.0125,
        "longitude": 73.7910,
        "destination_mandi": "Nashik APMC",
        "image_url": image_url,
    }
    payload.update(overrides)
    return payload


# ---------------------------------------------------------------------------
# Test suite
# ---------------------------------------------------------------------------

class TestLotRaceCondition(unittest.TestCase):

    def setUp(self):
        from app.db.engine import engine
        from sqlmodel import SQLModel
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS image_assessments"))
            conn.execute(text("DROP TABLE IF EXISTS crop_lots"))
            conn.commit()
        SQLModel.metadata.create_all(engine)
        self.client = TestClient(app)

    # ------------------------------------------------------------------
    # Test 1 — original hash/swap race condition
    # ------------------------------------------------------------------

    def test_publish_lot_race_condition(self):
        img_a_b64 = _make_b64(color=(255, 0, 0))
        img_b_b64 = _make_b64(color=(0, 255, 0))
        img_a_bytes = _make_bytes(color=(255, 0, 0))

        # Grade image A
        grade_res = self.client.post(
            "/api/ai/grade-image",
            files={"file": ("image_a.jpg", img_a_bytes, "image/jpeg")}
        )
        self.assertEqual(grade_res.status_code, 200, grade_res.text)
        self.assertIn("image_hash", grade_res.json())

        # Swapped to image B → 409 Conflict
        res = self.client.post("/api/marketplace/lots",
                               json=_base_payload(img_b_b64))
        self.assertEqual(res.status_code, 409)
        self.assertIn("image has changed since grading", res.json()["detail"].lower())

        # Original image A → 200 OK
        res = self.client.post("/api/marketplace/lots",
                               json=_base_payload(img_a_b64))
        self.assertEqual(res.status_code, 200, res.text)
        lot = res.json()
        self.assertEqual(lot["image_url"], img_a_b64)
        self.assertTrue(lot["is_ai_verified"])

    # ------------------------------------------------------------------
    # Test 2 — publish while grading is still PROCESSING
    # ------------------------------------------------------------------

    def test_publish_lot_grading_in_progress(self):
        img_c_b64 = _make_b64(color=(0, 0, 255))
        img_c_bytes = _make_bytes(color=(0, 0, 255))
        hash_c = hashlib.sha256(img_c_bytes).hexdigest()

        from app.db.engine import engine
        from sqlmodel import Session, select
        from app.models.database import ImageAssessment, AssessmentStatus

        # Seed a PROCESSING record
        with Session(engine) as session:
            existing = session.exec(
                select(ImageAssessment).where(ImageAssessment.image_hash == hash_c)
            ).first()
            if existing:
                session.delete(existing)
                session.commit()
            session.add(ImageAssessment(image_hash=hash_c, status=AssessmentStatus.PROCESSING))
            session.commit()

        # Status endpoint returns PROCESSING
        status_res = self.client.get(f"/api/ai/image-assessment/{hash_c}/status")
        self.assertEqual(status_res.status_code, 200)
        self.assertEqual(status_res.json()["status"], "PROCESSING")

        # Publish attempt → 409 (grading not COMPLETED)
        res = self.client.post("/api/marketplace/lots",
                               json=_base_payload(img_c_b64))
        self.assertEqual(res.status_code, 409)
        self.assertIn("image has changed since grading", res.json()["detail"].lower())

    # ------------------------------------------------------------------
    # Test 3 — missing farmer_confirmed_classification → 422
    # ------------------------------------------------------------------

    def test_publish_without_confirmation_flag_rejected(self):
        img_a_b64 = _make_b64(color=(200, 100, 50))
        img_a_bytes = _make_bytes(color=(200, 100, 50))

        # Grade the image so it's COMPLETED
        self.client.post(
            "/api/ai/grade-image",
            files={"file": ("img.jpg", img_a_bytes, "image/jpeg")}
        )

        # Omit farmer_confirmed_classification entirely → 422 Unprocessable
        payload = _base_payload(img_a_b64)
        del payload["farmer_confirmed_classification"]
        res = self.client.post("/api/marketplace/lots", json=payload)
        self.assertEqual(res.status_code, 422, res.text)

    # ------------------------------------------------------------------
    # Test 4 — farmer_confirmed_classification: false → 422 (model_validator)
    # ------------------------------------------------------------------

    def test_publish_with_confirmation_false_rejected(self):
        img_a_b64 = _make_b64(color=(180, 60, 60))
        img_a_bytes = _make_bytes(color=(180, 60, 60))

        self.client.post(
            "/api/ai/grade-image",
            files={"file": ("img.jpg", img_a_bytes, "image/jpeg")}
        )

        res = self.client.post("/api/marketplace/lots",
                               json=_base_payload(img_a_b64,
                                                  farmer_confirmed_classification=False))
        self.assertEqual(res.status_code, 422, res.text)
        body = res.json()
        detail_str = str(body).lower()
        self.assertIn("explicitly confirmed", detail_str)

    # ------------------------------------------------------------------
    # Test 5 — missing commodity_category → 422
    # ------------------------------------------------------------------

    def test_publish_missing_category_rejected(self):
        img_a_b64 = _make_b64(color=(80, 200, 80))
        img_a_bytes = _make_bytes(color=(80, 200, 80))

        self.client.post(
            "/api/ai/grade-image",
            files={"file": ("img.jpg", img_a_bytes, "image/jpeg")}
        )

        payload = _base_payload(img_a_b64)
        del payload["commodity_category"]
        res = self.client.post("/api/marketplace/lots", json=payload)
        self.assertEqual(res.status_code, 422, res.text)

    # ------------------------------------------------------------------
    # Test 6 — farmer overrides AI classification; lot uses farmer's values
    # ------------------------------------------------------------------

    def test_farmer_override_beats_ai_suggestion(self):
        """
        Scenario: AI auto-classifies a tomato photo as 'Banana / Grand Naine Robusta'.
        Farmer corrects it to 'Tomato / Hybrid Vaishali' before publishing.
        The published lot must reflect the farmer's confirmed values, NOT the AI guess.
        """
        img_bytes = _make_bytes(color=(220, 50, 50))   # stands in for a tomato photo
        img_b64 = _make_b64(color=(220, 50, 50))

        # Grade the image (AI will return whatever YOLO decides; we don't care about the label)
        grade_res = self.client.post(
            "/api/ai/grade-image",
            files={"file": ("tomato.jpg", img_bytes, "image/jpeg")}
        )
        self.assertEqual(grade_res.status_code, 200, grade_res.text)

        # Farmer explicitly overrides AI's wrong guess
        payload = _base_payload(
            img_b64,
            commodity="Tomato",
            commodity_category="Vegetables",
            variety="Hybrid Vaishali",
            farmer_confirmed_classification=True,
        )
        res = self.client.post("/api/marketplace/lots", json=payload)
        self.assertEqual(res.status_code, 200, res.text)

        lot = res.json()
        # Farmer-confirmed values are persisted, not the AI guess
        self.assertEqual(lot["commodity"], "Tomato")
        self.assertEqual(lot["commodity_category"], "Vegetables")
        self.assertEqual(lot["variety"], "Hybrid Vaishali")
        # AI grading (quality data) is still sourced from ImageAssessment
        self.assertTrue(lot["is_ai_verified"])


if __name__ == "__main__":
    unittest.main()
