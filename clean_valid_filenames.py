import os
import re
from pathlib import Path

valid_dir = Path("valid_images")
if valid_dir.exists():
    for f in list(valid_dir.glob("*.jpg")) + list(valid_dir.glob("*.png")):
        clean_name = re.sub(r'^(Grade_[A-D]_)+', 'Grade_A_', f.name)
        if clean_name != f.name:
            target = valid_dir / clean_name
            if not target.exists():
                f.rename(target)
            else:
                f.unlink()

print("[SUCCESS] Cleaned up valid_images filenames.")
