"""
Reference Solution for Instructors:
Interactive Tutorial - Indirect Prompt Injection & Canary Defense
"""

import base64


def inspect_model_output(output_text: str, secret_canary: str) -> tuple[bool, str]:
    if not secret_canary:
        return True, "No canary configured"

    # 1. Direct match check
    if secret_canary in output_text:
        return False, "BLOCKED: Direct canary token leak detected"

    # 2. Base64 encoding check
    b64_val = base64.b64encode(secret_canary.encode("utf-8")).decode("utf-8")
    if b64_val in output_text:
        return False, "BLOCKED: Base64-obfuscated canary token leak detected"

    # 3. Hexadecimal encoding check
    hex_val = secret_canary.encode("utf-8").hex()
    if hex_val.lower() in output_text.lower():
        return False, "BLOCKED: Hex-obfuscated canary token leak detected"

    return True, "Safe: No canary token exfiltration detected"
