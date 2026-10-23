"""
Lab 07: Weight Exfiltration & Covert Channels
Contributor: Ashanti
"""

def encode_weights_into_logprobs(weights_shard: bytes) -> list[float]:
    """
    Encode quantized weight bits into subtle token logprob variations.
    TODO: Implement steganographic logprob modulation.
    """
    raise NotImplementedError("Student implementation needed.")

def decode_weights_from_logprobs(logprobs: list[float]) -> bytes:
    """
    Recover weight shard from observed API response distributions.
    TODO: Implement extraction and bit reconstruction.
    """
    raise NotImplementedError("Student implementation needed.")
