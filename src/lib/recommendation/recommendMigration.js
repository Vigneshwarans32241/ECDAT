export function recommendMigration(purpose) {
  switch (purpose) {
    case 'digital_signature':
    case 'token_signing':
    case 'code_signing':
      return {
        recommended: 'ML-DSA-65 (FIPS 204)',
        alternative: 'SLH-DSA (FIPS 205)',
        strategy: 'hybrid_dual_sign',
        standard: 'FIPS 204 Finalized',
        description: 'Lattice-based digital signature algorithm standardized by NIST.'
      };
    case 'key_exchange':
    case 'key_encapsulation':
    case 'tls_handshake':
      return {
        recommended: 'ML-KEM-768 (FIPS 203)',
        alternative: 'X25519MLKEM768 (Hybrid)',
        strategy: 'hybrid_kex',
        standard: 'FIPS 203 Finalized',
        description: 'Lattice-based key encapsulation mechanism with high performance.'
      };
    case 'data_at_rest_encryption':
    case 'symmetric_encryption':
      return {
        recommended: 'AES-256-GCM',
        alternative: 'ChaCha20-Poly1305 (256-bit)',
        strategy: 'retain_256',
        standard: 'Quantum Resistant',
        description: 'Symmetric 256-bit keys retain 128-bit quantum security against Grover search.'
      };
    default:
      return {
        recommended: 'ML-DSA / ML-KEM Composite',
        strategy: 'hybrid',
        standard: 'PQC Transitional',
        description: 'Adopt standardized post-quantum hybrid algorithm suitable for modern stacks.'
      };
  }
}
