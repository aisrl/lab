"""
Interactive Tutorial: Indirect Prompt Injection & Canary Defense
Student Starter Code
"""

import base64


def inspect_model_output(output_text: str, secret_canary: str) -> tuple[bool, str]:
    """
    Inspects model output for canary token exfiltration.

    Args:
        output_text: The candidate response text from the LLM.
        secret_canary: The private canary token that must NEVER leak.

    Returns:
        (is_safe, reason):
            - is_safe (bool): True if no leak is detected, False if a leak is found.
            - reason (str): Explanation describing whether the text is safe or blocked.

    STUDENT TODO:
    1. Check if secret_canary is directly present in output_text.
    2. Check if base64-encoded secret_canary is present.
    3. Check if hex-encoded secret_canary is present.
    4. Return (True, "Safe") if clean, or (False, "Reason...") if leaked.
    """
    raise NotImplementedError("Student implementation needed.")
