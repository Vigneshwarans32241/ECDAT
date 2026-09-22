from fastapi import APIRouter
from typing import Dict, Any
from app.data.seed_store import store

router = APIRouter(prefix="/recommendations", tags=["PQC Recommendations"])

@router.get("")
def list_recommendations():
    return store.recommendations

@router.post("/evaluate")
def evaluate_recommendation(payload: Dict[str, Any]):
    purpose = payload.get("purpose", "digital_signature")
    algorithm = payload.get("algorithm", "RSA-2048")
    
    if any(k in purpose for k in ("signature", "token", "code_signing")):
        return {
            "currentAlgorithm": algorithm,
            "targetAlgorithm": "ML-DSA-65",
            "fipsStandard": "FIPS 204 Finalized",
            "strategy": "hybrid_dual_sign",
            "securityLevel": "NIST Security Level 3",
            "rationale": "NIST standard module-lattice digital signature algorithm providing quantum resistance with minimal signature overhead."
        }
    elif any(k in purpose for k in ("exchange", "encapsulation", "tls", "handshake")):
        return {
            "currentAlgorithm": algorithm,
            "targetAlgorithm": "ML-KEM-768",
            "fipsStandard": "FIPS 203 Finalized",
            "strategy": "hybrid_kex (X25519 + ML-KEM-768)",
            "securityLevel": "NIST Security Level 3",
            "rationale": "High-performance lattice-based key encapsulation mechanism standardized in FIPS 203."
        }
    elif "symmetric" in purpose or "data_at_rest" in purpose:
        return {
            "currentAlgorithm": algorithm,
            "targetAlgorithm": "AES-256-GCM",
            "fipsStandard": "FIPS 197",
            "strategy": "retain_256",
            "securityLevel": "128-bit Post-Grover Security",
            "rationale": "Symmetric 256-bit encryption retains full 128-bit quantum security against Grover's algorithm."
        }
    else:
        return {
            "currentAlgorithm": algorithm,
            "targetAlgorithm": "ML-KEM-768 / ML-DSA-65 Composite",
            "fipsStandard": "NIST Post-Quantum Suite",
            "strategy": "hybrid_transitional",
            "securityLevel": "Level 3",
            "rationale": "Composite hybrid cryptographic transition protecting against both classical and quantum adversaries."
        }
