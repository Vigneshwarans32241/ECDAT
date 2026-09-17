export const DEMO_DETECTION_RULES = [
  {
    id: 'RULE-RSA-GEN',
    name: 'RSA Key Generation / Cipher',
    pattern: /(?:RSA(?:KeyPairGenerator|Cipher|KeyFactory|\.generate_private_key|\.SignPSS|\.GenerateKey)?|PKCS1_OAEP|RSA_PKCS1_PADDING)/gi,
    family: 'RSA',
    quantum: 'vulnerable',
    confidence: 0.95,
    severity: 'critical',
    category: 'Asymmetric Cryptography'
  },
  {
    id: 'RULE-ECC-ECDSA',
    name: 'ECDSA / Elliptic Curve',
    pattern: /(?:ECDSA|secp256r1|prime256v1|P-256|ECDH|EllipticCurvePrivateKey|generate_jwt.*ES256)/gi,
    family: 'ECC',
    quantum: 'vulnerable',
    confidence: 0.96,
    severity: 'critical',
    category: 'Asymmetric Cryptography'
  },
  {
    id: 'RULE-SYM-AES',
    name: 'AES Symmetric Cipher',
    pattern: /(?:AES\/(?:GCM|CBC|CTR)\/NoPadding|AES-256-GCM|AES-128-GCM|Cipher\.getInstance\("AES)/gi,
    family: 'AES',
    quantum: 'safe',
    confidence: 0.99,
    severity: 'low',
    category: 'Symmetric Encryption'
  },
  {
    id: 'RULE-HASH-SHA1-MD5',
    name: 'Broken Legacy Hash (SHA-1 / MD5)',
    pattern: /(?:MD5|SHA-1|SHA1|MessageDigest\.getInstance\("(?:MD5|SHA-1)"\))/gi,
    family: 'Legacy Hash',
    quantum: 'vulnerable',
    confidence: 0.99,
    severity: 'high',
    category: 'Hashing'
  },
  {
    id: 'RULE-PQC-MLKEM',
    name: 'Post-Quantum Lattice Scheme (ML-KEM / ML-DSA)',
    pattern: /(?:ML-KEM|ML-DSA|Dilithium|Kyber|Falcon|SLH-DSA|SPHINCS\+|X25519MLKEM768)/gi,
    family: 'PQC',
    quantum: 'pqc_native',
    confidence: 0.98,
    severity: 'info',
    category: 'Post-Quantum Cryptography'
  }
];
