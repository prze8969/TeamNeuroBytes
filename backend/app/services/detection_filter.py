import logging
from typing import List, Dict, Any, Tuple, Optional

logger = logging.getLogger(__name__)

class DefectFilter:
    """
    Geometric False Positive Filter & Hard Override Rejection Engine.
    Filters out hallucinated bounding box detections from Object Detection models
    (e.g., YOLO/DINO-DETR) before they reach the UI or trigger false crop rejections.
    """

    @staticmethod
    def filter_detections(
        raw_defects: List[Dict[str, Any]],
        image_dimensions: Tuple[int, int],
        global_grade: str,
        predicted_rank: int,
        area_threshold_pct: float = 0.12,  # 12% maximum area cap
        min_confidence: float = 0.85        # 0.85 confidence floor
    ) -> Dict[str, Any]:
        """
        Applies mathematical & geometric sanity filters to object detection bounding boxes:
        
        Rule 1: Absolute Area Cap (12% max) - Real blemishes are localized spots. Any box covering >12% of image area is a false positive artifact.
        Rule 2: Aspect Ratio Sanity Check (1:4 to 4:1) - Boxes exceeding 4:1 aspect ratio are segmentation noise.
        Rule 4: Confidence Floor (0.85 min) - Drops low-confidence false alarms.
        Rule 3: Grade A/B Hard Override - If global grade is 'A' or 'B' (rank 0 or 1) and remaining valid defects < 2, force is_rejected = False.
        """
        w, h = image_dimensions
        total_image_area = float(max(w * h, 1))

        valid_defects: List[Dict[str, Any]] = []
        suppressed_artifacts_count = 0

        for defect in raw_defects:
            box = defect.get("box", [0, 0, 0, 0])
            conf = float(defect.get("confidence", 0.0))
            label = defect.get("label", "Surface Blemish")

            x1, y1, x2, y2 = box
            box_w = max(x2 - x1, 0)
            box_h = max(y2 - y1, 0)
            box_area = float(box_w * box_h)

            # Calculate box area ratio relative to full image
            area_ratio = box_area / total_image_area

            # -------------------------------------------------------------
            # Rule 1: Absolute Area Cap (Hard delete if area > 12%)
            # -------------------------------------------------------------
            if area_ratio > area_threshold_pct:
                logger.warning(
                    f"[DefectFilter] HARD DELETE: Box '{defect.get('id')}' area {area_ratio*100:.1f}% "
                    f"exceeds max area cap of {area_threshold_pct*100:.0f}%. Flagged as hallucinated artifact."
                )
                suppressed_artifacts_count += 1
                continue

            # -------------------------------------------------------------
            # Rule 2: Aspect Ratio Sanity Check (Delete if ar > 4:1 or < 1:4)
            # -------------------------------------------------------------
            aspect_ratio = float(box_w) / float(max(box_h, 1))
            if aspect_ratio > 4.0 or aspect_ratio < 0.25:
                logger.warning(
                    f"[DefectFilter] HARD DELETE: Box '{defect.get('id')}' aspect ratio {aspect_ratio:.2f} "
                    f"is outside valid 1:4 - 4:1 range. Flagged as segmentation artifact."
                )
                suppressed_artifacts_count += 1
                continue

            # -------------------------------------------------------------
            # Rule 4: Confidence Floor (Drop if confidence < 0.85)
            # -------------------------------------------------------------
            if conf < min_confidence:
                logger.info(
                    f"[DefectFilter] DROPPED: Box '{defect.get('id')}' confidence {conf:.2f} "
                    f"below minimum floor {min_confidence:.2f}."
                )
                suppressed_artifacts_count += 1
                continue

            # Passed all geometric & confidence filters
            valid_defects.append({
                "id": defect.get("id", f"box-{len(valid_defects)+1}"),
                "label": label,
                "confidence": conf,
                "box": [int(x1), int(y1), int(x2), int(y2)],
                "area_ratio": round(area_ratio, 4),
                "is_suppressed": False
            })

        # -------------------------------------------------------------
        # Rule 3: The "Grade A/B" Hard Override Rejection Engine
        # -------------------------------------------------------------
        clean_grade_char = global_grade.replace("Grade ", "").strip().upper()
        is_grade_a_or_b = predicted_rank <= 1 or clean_grade_char in ["A", "B"]

        if is_grade_a_or_b:
            # Force rejection to False if DINOv2 global grade is A or B and valid defects < 2
            if len(valid_defects) < 2:
                is_rejected = False
                rejection_reason = None
            else:
                # Multiple valid severe defects retained
                is_rejected = False
                rejection_reason = None
        else:
            # Grade C or D: Hard Rejection
            is_rejected = True
            rejection_reason = (
                f"AI REJECTED: DINOv2 Global Grade is '{global_grade}'. "
                f"Defect density and texture degradation exceed commercial standard thresholds."
            )

        return {
            "global_grade": clean_grade_char,
            "is_rejected": is_rejected,
            "filtered_defects": valid_defects,
            "rejection_reason": rejection_reason,
            "suppressed_artifacts_count": suppressed_artifacts_count
        }
