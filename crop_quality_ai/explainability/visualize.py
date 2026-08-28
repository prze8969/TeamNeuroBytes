import os
import torch
import numpy as np
import cv2
import matplotlib.pyplot as plt

def generate_crop_saliency_map(model: torch.nn.Module, image_tensor: torch.Tensor, quality_feat_tensor: torch.Tensor, output_path: str = "results/explainability_attention.png"):
    """
    Generates a visual saliency heatmap showing which parts of the crop image
    contributed to the ordinal grade prediction.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    model.eval()

    image_tensor = image_tensor.clone().detach().requires_grad_(True)
    logits, probs, score = model(image_tensor, quality_feat_tensor)

    target_class = torch.argmax(probs, dim=-1)
    target_prob = probs[0, target_class]
    target_prob.backward()

    saliency, _ = torch.max(image_tensor.grad.data.abs(), dim=1)
    saliency = saliency[0].cpu().numpy()

    # Normalize saliency heatmap 0..1
    saliency = (saliency - saliency.min()) / (saliency.max() - saliency.min() + 1e-8)
    saliency_uint8 = np.uint8(255 * saliency)
    heatmap = cv2.applyColorMap(saliency_uint8, cv2.COLORMAP_JET)

    orig_img = image_tensor[0].detach().cpu().permute(1, 2, 0).numpy()
    orig_img = (orig_img - orig_img.min()) / (orig_img.max() - orig_img.min() + 1e-8)
    orig_uint8 = np.uint8(255 * orig_img)

    overlay = cv2.addWeighted(orig_uint8, 0.6, heatmap, 0.4, 0)

    fig, axes = plt.subplots(1, 3, figsize=(12, 4))
    axes[0].imshow(orig_img)
    axes[0].set_title("Input Crop Image", fontweight="bold")
    axes[0].axis("off")

    axes[1].imshow(saliency, cmap="hot")
    axes[1].set_title("Salient Feature Map", fontweight="bold")
    axes[1].axis("off")

    axes[2].imshow(cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB))
    axes[2].set_title(f"Explainability Heatmap (Grade {target_class.item()})", fontweight="bold")
    axes[2].axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()
    print(f"[OK] Saved saliency explainability map to: {output_path}")
