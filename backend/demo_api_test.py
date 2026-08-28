import os
import sys
import json
import base64
import time
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

def run_end_to_end_demo():
    print("=" * 70)
    print("      CROP QUALITY AI (DINOv2 + CORAL) END-TO-END FASTAPI DEMO")
    print("=" * 70)

    # Initialize TestClient which triggers FastAPI lifespan startup pre-loading
    print("[INIT] Launching FastAPI Test Client & Preloading Model into VRAM...")
    start_init = time.time()
    with TestClient(app) as client:
        init_time = (time.time() - start_init) * 1000.0
        print(f"[SUCCESS] FastAPI lifespan pre-loaded model in {init_time:.2f} ms\n")

        # 1. TEST GET /api/ai/v2/health
        print("----------------------------------------------------------------------")
        print("TEST 1: Model Health Check (GET /api/ai/v2/health)")
        print("----------------------------------------------------------------------")
        res_health = client.get("/api/ai/v2/health")
        print(f"HTTP Status: {res_health.status_code}")
        print("Response Body:")
        print(json.dumps(res_health.json(), indent=2))
        assert res_health.status_code == 200
        assert res_health.json()["loaded"] is True

        # Locate sample produce photo
        workspace_dir = os.path.abspath(os.path.join(backend_dir, ".."))
        sample_img_path = os.path.join(workspace_dir, "valid_images", "Grade_A_tomato_Grade_A_0000.jpg")
        if not os.path.exists(sample_img_path):
            sample_img_path = os.path.join(workspace_dir, "crop_quality_ai", "data", "Grade_A", "tomato_Grade_A_0000.jpg")

        print(f"\nTarget Sample Produce Image: '{sample_img_path}'")
        with open(sample_img_path, "rb") as f:
            img_bytes = f.read()

        # 2. TEST POST /api/ai/v2/grade-image (Multipart File Upload)
        print("\n----------------------------------------------------------------------")
        print("TEST 2: Grade Produce Image Upload (POST /api/ai/v2/grade-image)")
        print("----------------------------------------------------------------------")
        start_t = time.time()
        res_upload = client.post(
            "/api/ai/v2/grade-image",
            files={"file": ("sample_produce.jpg", img_bytes, "image/jpeg")}
        )
        latency_ms = (time.time() - start_t) * 1000.0

        print(f"HTTP Status: {res_upload.status_code}")
        print(f"End-to-End HTTP Request Latency: {latency_ms:.2f} ms")
        print("Response Body:")
        print(json.dumps(res_upload.json(), indent=2))
        assert res_upload.status_code == 200
        assert res_upload.json()["grade"] == "A"

        # 3. TEST POST /api/ai/v2/grade-base64 (Base64 JSON String Payload)
        print("\n----------------------------------------------------------------------")
        print("TEST 3: Grade Base64 Encoded Image (POST /api/ai/v2/grade-base64)")
        print("----------------------------------------------------------------------")
        b64_encoded = base64.b64encode(img_bytes).decode("utf-8")
        payload = {"base64_image": f"data:image/jpeg;base64,{b64_encoded}", "commodity_hint": "Tomato"}

        start_t = time.time()
        res_b64 = client.post(
            "/api/ai/v2/grade-base64",
            json=payload
        )
        b64_latency_ms = (time.time() - start_t) * 1000.0

        print(f"HTTP Status: {res_b64.status_code}")
        print(f"End-to-End Base64 HTTP Latency: {b64_latency_ms:.2f} ms")
        print("Response Body:")
        print(json.dumps(res_b64.json(), indent=2))
        assert res_b64.status_code == 200
        assert res_b64.json()["grade"] == "A"

    print("\n" + "=" * 70)
    print("     ALL END-TO-END FASTAPI API DEMO TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_end_to_end_demo()
