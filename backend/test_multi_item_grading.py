import sys
import os
import io
import time
import numpy as np
from PIL import Image, ImageDraw

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def generate_test_multi_item_image():
    """Generates a synthetic produce image containing multiple items (apples/tomatoes)."""
    img = Image.new('RGB', (800, 600), color=(240, 240, 235))
    draw = ImageDraw.Draw(img)

    # Draw several produce items (circles with varying colors)
    produce_items = [
        (100, 100, 220, 220, (220, 40, 40)),   # Red tomato
        (300, 120, 430, 250, (230, 50, 40)),   # Red tomato
        (500, 90, 620, 210, (210, 35, 35)),    # Red tomato
        (150, 320, 270, 440, (180, 160, 40)),  # Slightly greenish/yellowish
        (360, 310, 480, 430, (225, 45, 45)),   # Red tomato
        (550, 330, 680, 460, (120, 100, 50)),  # Dark/browning tomato
    ]

    for (x1, y1, x2, y2, color) in produce_items:
        draw.ellipse([x1, y1, x2, y2], fill=color, outline=(50, 50, 50), width=2)

    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return buf.getvalue()

def run_tests():
    print("==========================================================")
    print("TESTING MULTI-ITEM CROP GRADING AI PIPELINE")
    print("==========================================================")

    from app.core.ml_models.crop_quality_predictor import crop_quality_predictor
    from app.services.crop_quality_service import crop_quality_service

    test_bytes = generate_test_multi_item_image()
    print(f"[1] Generated test multi-item produce image: {len(test_bytes)} bytes")

    # Test predictor directly
    t0 = time.time()
    res = crop_quality_predictor.predict_multi_item(test_bytes)
    t_el = (time.time() - t0) * 1000

    print(f"[2] Predictor direct multi-item execution completed in {t_el:.2f}ms")
    print(f"    - Items Detected: {res.get('items_count')}")
    print(f"    - Overall Grade: {res.get('overall_grade')}")
    print(f"    - Overall Score: {res.get('overall_quality_score')}%")
    print(f"    - Distribution: {res.get('distribution')}")
    print(f"    - Distribution Pct: {res.get('distribution_pct')}")
    print(f"    - Trade Rec: {res.get('trade_recommendation')}")
    print(f"    - Items details count: {len(res.get('items', []))}")

    assert res.get('items_count', 0) > 0, "Should detect at least 1 produce item"
    assert 'overall_grade' in res, "Response missing overall_grade"
    assert 'distribution' in res, "Response missing distribution"
    assert 'items' in res, "Response missing items"

    # Test service layer wrapper
    svc_res = crop_quality_service.grade_multi_item_bytes(test_bytes)
    print(f"[3] CropQualityService.grade_multi_item_bytes test: PASSED (Detected {svc_res.get('items_count')} items)")

    print("\n✅ ALL MULTI-ITEM CROP GRADING AI TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
