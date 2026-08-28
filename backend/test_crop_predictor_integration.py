import os
import sys
import json
import time

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.ml_models.crop_quality_predictor import crop_quality_predictor
from app.services.crop_quality_service import crop_quality_service

def test_integration():
    print("=" * 60)
    print("TESTING DINOv2 CROP QUALITY PREDICTOR BACKEND INTEGRATION")
    print("=" * 60)

    # 1. Test Model Loading & Health Check
    crop_quality_predictor.load_model()
    health = crop_quality_service.get_health()
    print("[1/3] Health Check Output:")
    print(json.dumps(health, indent=2))

    assert health["loaded"] is True, "Model failed to load!"

    # 2. Test Prediction on Sample Image
    workspace_dir = os.path.abspath(os.path.join(backend_dir, ".."))
    sample_img_path = os.path.join(workspace_dir, "valid_images", "Grade_A_tomato_Grade_A_0000.jpg")

    if not os.path.exists(sample_img_path):
        sample_img_path = os.path.join(workspace_dir, "crop_quality_ai", "data", "Grade_A", "tomato_Grade_A_0000.jpg")

    print(f"\n[2/3] Running prediction on sample image: '{sample_img_path}'...")
    with open(sample_img_path, "rb") as f:
        img_bytes = f.read()

    start_t = time.time()
    res = crop_quality_service.grade_image_bytes(img_bytes)
    total_time_ms = (time.time() - start_t) * 1000.0

    print("[3/3] Prediction Result Payload:")
    print(json.dumps(res, indent=2))

    print(f"\n[OK] Latency Benchmark: {total_time_ms:.2f} ms")
    assert "grade" in res, "Missing 'grade' in prediction result!"
    assert "confidence" in res, "Missing 'confidence' in prediction result!"
    assert "quality_score" in res, "Missing 'quality_score' in prediction result!"
    assert "probabilities" in res, "Missing 'probabilities' in prediction result!"

    print("=" * 60)
    print("ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_integration()
