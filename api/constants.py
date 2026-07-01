"""Shared validation constants and helpers used across routes."""
import re

VALID_BLOOD  = {'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'}
VALID_CITIES = {'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Goa', 'Vizag'}

PHONE_RE      = re.compile(r'^\d{10}$')
_UNSAFE_TEXT  = re.compile(r'[<>"\']')     # block HTML-injection chars in free text


def clean_text(v: str) -> str:
    """Strip HTML-injection characters and surrounding whitespace from free text."""
    return _UNSAFE_TEXT.sub('', v or '').strip()
