import re
from typing import List, Dict, Any

RULES = [
    {
        "id": "RULE-RSA-GEN",
        "name": "RSA Key Generation / Deprecated Cipher",
        "pattern": r"(?:RSA(?:KeyPairGenerator|Cipher|KeyFactory|\.generate_private_key|\.SignPSS|\.GenerateKey)?|PKCS1_OAEP|RSA_PKCS1_PADDING)",
        "family": "RSA",
        "quantum": "vulnerable",
        "confidence": 0.96,
        "severity": "critical",
        "recommendation": "Transition to ML-DSA-65 (FIPS 204) for signing or ML-KEM-768 (FIPS 203) for key exchange."
    },
    {
        "id": "RULE-ECC-ECDSA",
        "name": "ECDSA / Elliptic Curve (Shor Vulnerable)",
        "pattern": r"(?:ECDSA|secp256r1|prime256v1|P-256|ECDH|EllipticCurvePrivateKey|generate_jwt.*ES256)",
        "family": "ECC",
        "quantum": "vulnerable",
        "confidence": 0.98,
        "severity": "critical",
        "recommendation": "Replace ECDSA / ECDH with ML-DSA-65 or hybrid X25519MLKEM768."
    },
    {
        "id": "RULE-SYM-AES",
        "name": "AES Symmetric Cipher",
        "pattern": r"(?:AES\/(?:GCM|CBC|CTR)\/NoPadding|AES-256-GCM|AES-128-GCM|Cipher\.getInstance\(\"AES)",
        "family": "AES",
        "quantum": "safe",
        "confidence": 0.99,
        "severity": "low",
        "recommendation": "AES-256 is quantum-safe. Ensure AES-128 keys are upgraded to 256-bit to maintain 128-bit quantum security."
    },
    {
        "id": "RULE-HASH-SHA1-MD5",
        "name": "Broken Legacy Hash (SHA-1 / MD5)",
        "pattern": r"(?:MD5|SHA-1|SHA1|MessageDigest\.getInstance\(\"(?:MD5|SHA-1)\"\))",
        "family": "Legacy Hash",
        "quantum": "vulnerable",
        "confidence": 0.99,
        "severity": "high",
        "recommendation": "Upgrade to SHA-256, SHA-384, or SHA3-256 immediately."
    },
    {
        "id": "RULE-PQC-MLKEM",
        "name": "Post-Quantum Cryptography (ML-KEM / ML-DSA)",
        "pattern": r"(?:ML-KEM|ML-DSA|Dilithium|Kyber|Falcon|SLH-DSA|SPHINCS\+|X25519MLKEM768)",
        "family": "PQC",
        "quantum": "pqc_native",
        "confidence": 0.99,
        "severity": "info",
        "recommendation": "NIST standardized post-quantum scheme detected. Verified quantum-resistant."
    }
]

class CodeAnalyzer:
    def analyze_snippet(self, code_text: str, filename: str = "snippet.txt") -> List[Dict[str, Any]]:
        findings = []
        lines = code_text.splitlines()
        
        for rule in RULES:
            regex = re.compile(rule["pattern"], re.IGNORECASE)
            for idx, line in enumerate(lines):
                match = regex.search(line)
                if match:
                    findings.append({
                        "id": f"FIND-{len(findings) + 1:04d}",
                        "ruleId": rule["id"],
                        "name": rule["name"],
                        "severity": rule["severity"],
                        "algorithm": rule["family"],
                        "file": filename,
                        "line": idx + 1,
                        "codeSnippet": line.strip()[:120],
                        "recommendation": rule["recommendation"],
                        "confidence": rule["confidence"]
                    })
        return findings

analyzer = CodeAnalyzer()
