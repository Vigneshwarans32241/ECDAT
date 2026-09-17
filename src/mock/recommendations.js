export const mockRecommendations = [
  {
    id: 'REC-001',
    assetId: 'CRYPTO-00182',
    applicationId: 'APP-001',
    applicationName: 'Payment API',
    currentAlgorithm: 'RSA-2048 PSS',
    currentPurpose: 'digital_signature',
    recommendedAlgorithm: 'ML-DSA-65 (Dilithium3) / Hybrid RSA',
    nistStatus: 'FIPS 204 Standardized',
    strategy: 'hybrid_dual_sign',
    complexity: 'medium',
    compatibility: 'high',
    priority: 'critical',
    targetDate: '2026-12-15',
    status: 'in_review',
    rationale: 'NIST standardized lattice-based signature scheme. Hybrid mode allows legacy verifiers to maintain compliance while quantum protection is applied immediately.',
    steps: [
      'Upgrade Go crypto wrapper to support composite X.509 dual signatures',
      'Generate parallel ML-DSA-65 keypair alongside existing RSA-2048 key',
      'Update payment payload format to include composite signature container',
      'Staged rollout across checkout-worker instances'
    ]
  },
  {
    id: 'REC-002',
    assetId: 'CRYPTO-00149',
    applicationId: 'APP-003',
    applicationName: 'Identity Service',
    currentAlgorithm: 'ECDSA P-256',
    currentPurpose: 'token_signing',
    recommendedAlgorithm: 'ML-DSA-44 (Dilithium2)',
    nistStatus: 'FIPS 204 Standardized',
    strategy: 'direct_replacement',
    complexity: 'low',
    compatibility: 'high',
    priority: 'high',
    targetDate: '2027-02-28',
    status: 'planned',
    rationale: 'Short-lived JWT tokens can be migrated directly without legacy backward compatibility constraints once internal gateways update public key JWKS.',
    steps: [
      'Publish ML-DSA-44 public keys to /.well-known/jwks.json',
      'Update Nimbus JOSE dependency to post-quantum enabled fork',
      'Switch token signing header alg to ML-DSA-44'
    ]
  },
  {
    id: 'REC-003',
    assetId: 'CRYPTO-00092',
    applicationId: 'APP-002',
    applicationName: 'Customer Portal',
    currentAlgorithm: 'ECDH P-256',
    currentPurpose: 'key_exchange',
    recommendedAlgorithm: 'X25519MLKEM768 (Hybrid)',
    nistStatus: 'FIPS 203 + IETF Draft',
    strategy: 'hybrid_kex',
    complexity: 'medium',
    compatibility: 'high',
    priority: 'high',
    targetDate: '2026-11-30',
    status: 'in_progress',
    rationale: 'Combines classical X25519 with lattice-based ML-KEM-768 for TLS 1.3 handshakes. Ensures no regression if lattice implementation has flaws.',
    steps: [
      'Enable hybrid key exchange flag on Envoy edge gateway',
      'Verify client handshake success rates across major browsers (Chrome 124+, Firefox 128+)',
      'Enforce fallback telemetry to detect legacy client dropouts'
    ]
  },
  {
    id: 'REC-004',
    assetId: 'CRYPTO-00204',
    applicationId: 'APP-006',
    applicationName: 'Settlement Engine',
    currentAlgorithm: 'AES-256-GCM',
    currentPurpose: 'data_at_rest_encryption',
    recommendedAlgorithm: 'Retain AES-256-GCM',
    nistStatus: 'Fully Quantum Resistant',
    strategy: 'maintain',
    complexity: 'none',
    compatibility: 'full',
    priority: 'low',
    targetDate: '2028-01-01',
    status: 'completed',
    rationale: 'Symmetric encryption with 256-bit key provides 128 bits of security against Grover search, sufficient for the foreseeable future.',
    steps: [
      'Periodically rotate master data keys via KMS',
      'Verify nonce uniqueness to prevent GCM reuse vulnerability'
    ]
  }
];
