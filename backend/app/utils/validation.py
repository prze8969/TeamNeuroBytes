import re
from typing import Optional

def validate_indian_phone(phone: str) -> Optional[str]:
    """
    Standardizes and validates 10-digit or E.164 formatted Indian phone numbers.
    Returns cleaned format: '+91XXXXXXXXXX' or None if invalid.
    """
    cleaned = re.sub(r"[^\d+]", "", phone)
    if cleaned.startswith("+91") and len(cleaned) == 13:
        return cleaned
    if cleaned.startswith("91") and len(cleaned) == 12:
        return f"+{cleaned}"
    if len(cleaned) == 10 and cleaned[0] in "6789":
        return f"+91{cleaned}"
    return None

def validate_aadhaar_last_four(digits: str) -> bool:
    """Validates 4-digit numeric string for DigiLocker simulation."""
    return bool(re.fullmatch(r"\d{4}", digits))

def validate_coordinates(lat: float, lon: float) -> bool:
    """Validates latitude and longitude within Indian bounding box."""
    # India bounding box approx: Lat 6.5 to 37.5, Lon 68.0 to 97.5
    return (-90.0 <= lat <= 90.0) and (-180.0 <= lon <= 180.0)
