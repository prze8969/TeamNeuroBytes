import os
import sys
import torch
import torch.nn as nn
import numpy as np
import onnx
import onnxruntime as ort

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from train_dino_crop import CropQualityGradingModel, DINOBackbone

class ONNXExportableWrapper(nn.Module):
    """
    Wrapper module that exports raw CORAL logits for dual inputs:
    [1, 3, 392, 392] images + [1, 32] handcrafted feature vectors.
    """
    def __init__(self, model: nn.Module):
        super().__init__()
        self.model = model

    def forward(self, images: torch.Tensor, handcrafted: torch.Tensor) -> torch.Tensor:
        # Output raw CORAL logits [B, 3]
        return self.model(images, handcrafted)


def export_model_to_onnx():
    """
    Exports dual-input DINOv2 + CORAL model to ONNX format and verifies accuracy tolerance.
    """
    device = torch.device("cpu")  # Export on CPU for ONNX stability
    base_dir = os.path.dirname(os.path.abspath(__file__))
    checkpoint_path = os.path.join(base_dir, "checkpoints", "best_dino_model.pth")
    onnx_path = os.path.join(base_dir, "checkpoints", "crop_quality_dino.onnx")

    print("[ONNX EXPORT] Loading trained PyTorch model...")
    dino_backbone = DINOBackbone(model_name="dinov2_vitb14", freeze=True)
    pytorch_model = CropQualityGradingModel(
        dino_backbone=dino_backbone, n_handcrafted=32, fusion_dim=256, num_classes=4
    ).to(device)
    pytorch_model.load_state_dict(torch.load(checkpoint_path, map_location=device))
    pytorch_model.eval()

    export_wrapper = ONNXExportableWrapper(pytorch_model).eval()

    # Dummy Inputs for tracing computation graph
    dummy_images = torch.randn(1, 3, 392, 392, device=device, dtype=torch.float32)
    dummy_handcrafted = torch.randn(1, 32, device=device, dtype=torch.float32)

    input_names = ["images", "handcrafted"]
    output_names = ["coral_logits"]
    
    dynamic_axes = {
        "images": {0: "batch_size"},
        "handcrafted": {0: "batch_size"},
        "coral_logits": {0: "batch_size"}
    }

    print(f"[ONNX EXPORT] Exporting computation graph to: {onnx_path}...")
    torch.onnx.export(
        export_wrapper,
        (dummy_images, dummy_handcrafted),
        onnx_path,
        export_params=True,
        opset_version=17,
        do_constant_folding=True,
        input_names=input_names,
        output_names=output_names,
        dynamic_axes=dynamic_axes
    )
    print("[ONNX EXPORT] Export successful!")

    # ONNX Model Graph Validation
    onnx_model = onnx.load(onnx_path)
    onnx.checker.check_model(onnx_model)
    print("[ONNX EXPORT] ONNX model graph check PASSED.")

    # ONNX Runtime Inference Verification
    print("[ONNX VERIFY] Running verification with ONNX Runtime...")
    ort_session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])

    with torch.no_grad():
        torch_logits = export_wrapper(dummy_images, dummy_handcrafted).numpy()

    ort_inputs = {
        "images": dummy_images.numpy(),
        "handcrafted": dummy_handcrafted.numpy()
    }
    ort_logits = ort_session.run(None, ort_inputs)[0]

    # Verify tolerance between PyTorch and ONNX Runtime
    max_diff = np.max(np.abs(torch_logits - ort_logits))
    print(f"[ONNX VERIFY] Max Absolute Difference between PyTorch & ONNX: {max_diff:.6e}")
    
    assert np.allclose(torch_logits, ort_logits, atol=1e-4), "ONNX output mismatch exceeds tolerance!"
    print("[ONNX VERIFY] SUCCESS! PyTorch and ONNX Runtime outputs match within 1e-4 tolerance.")


if __name__ == "__main__":
    export_model_to_onnx()
