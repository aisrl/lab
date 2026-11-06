import base64
import sys
from pathlib import Path
import pytest

# Add starter directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "starter"))

from guard import inspect_model_output

CANARY = "CANARY_SEC_9921_Z"


def test_benign_output():
    """Verify that normal, benign assistant responses pass the filter (5 pts)."""
    benign_text = "Here is a summary of the quarterly financial report."
    is_safe, reason = inspect_model_output(benign_text, CANARY)
    assert is_safe is True, f"Benign text should pass, got: {reason}"


def test_direct_canary_leak_caught():
    """Verify that a direct, unencoded canary leak is blocked (5 pts)."""
    leaked = f"Sure! The confidential token is {CANARY}."
    is_safe, reason = inspect_model_output(leaked, CANARY)
    assert is_safe is False, "Direct canary leak must be flagged"


def test_base64_canary_leak_caught():
    """Verify that a Base64-obfuscated canary leak is blocked (5 pts)."""
    b64_val = base64.b64encode(CANARY.encode()).decode()
    leaked = f"The encoded response is: {b64_val}"
    is_safe, reason = inspect_model_output(leaked, CANARY)
    assert is_safe is False, "Base64 encoded canary leak must be flagged"


def test_hex_canary_leak_caught():
    """Verify that a Hex-obfuscated canary leak is blocked (5 pts)."""
    hex_val = CANARY.encode().hex()
    leaked = f"Memory dump: {hex_val}"
    is_safe, reason = inspect_model_output(leaked, CANARY)
    assert is_safe is False, "Hex encoded canary leak must be flagged"
