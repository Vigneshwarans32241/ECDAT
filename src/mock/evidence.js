export const mockEvidence = [
  {
    id: 'EVID-001',
    assetId: 'CRYPTO-00182',
    ruleId: 'SEC-RSA-KEYGEN-01',
    ruleName: 'Insecure or Quantum-Vulnerable RSA Usage',
    filePath: 'services/checkout/src/crypto/signer.go',
    startLine: 42,
    endLine: 56,
    codeSnippet: `// Checkout transaction payload signing
func SignTransaction(payload []byte, privKey *rsa.PrivateKey) ([]byte, error) {
    hashed := sha256.Sum256(payload)
    opts := &rsa.PSSOptions{
        SaltLength: rsa.PSSSaltLengthEqualsHash,
        Hash:       crypto.SHA256,
    }
    return rsa.SignPSS(rand.Reader, privKey, crypto.SHA256, hashed[:], opts)
}`,
    detector: 'ast-go-crypto',
    confidence: 0.994,
    detectedAt: '2026-09-17T08:30:00Z',
    matchedPattern: 'rsa.SignPSS(..., rsa.PSSSaltLengthEqualsHash)',
    context: {
      repository: 'github.com/enterprise/checkout-service',
      commit: '8f4c2b9a',
      branch: 'main'
    }
  },
  {
    id: 'EVID-002',
    assetId: 'CRYPTO-00149',
    ruleId: 'SEC-ECC-ECDSA-02',
    ruleName: 'Classical Elliptic Curve Signature',
    filePath: 'auth/oauth/tokens/jwt_issuer.py',
    startLine: 114,
    endLine: 126,
    codeSnippet: `# OAuth2 Access Token Signer
def generate_jwt_token(claims: dict, ec_key: EllipticCurvePrivateKey) -> str:
    header = {'alg': 'ES256', 'typ': 'JWT'}
    return jwt.encode(
        claims,
        ec_key,
        algorithm='ES256',
        headers=header
    )`,
    detector: 'python-ast-detector',
    confidence: 0.987,
    detectedAt: '2026-09-17T08:30:00Z',
    matchedPattern: 'algorithm="ES256" with secp256r1 curve',
    context: {
      repository: 'github.com/enterprise/identity-provider',
      commit: '3a1d90ef',
      branch: 'main'
    }
  },
  {
    id: 'EVID-003',
    assetId: 'CRYPTO-00092',
    ruleId: 'SEC-TLS-ECDH-01',
    ruleName: 'Ephemeral Diffie-Hellman Key Exchange',
    filePath: 'ingress/envoy/tls_config.yaml',
    startLine: 28,
    endLine: 38,
    codeSnippet: `common_tls_context:
  tls_certificates:
    - certificate_chain: { filename: "/certs/portal.crt" }
      private_key: { filename: "/certs/portal.key" }
  validation_context:
    trusted_ca: { filename: "/certs/ca-chain.crt" }
  tls_params:
    ecdh_curves: ["P-256", "X25519"]
    tls_minimum_protocol_version: TLSv1_2`,
    detector: 'yaml-config-analyzer',
    confidence: 0.950,
    detectedAt: '2026-09-17T08:30:00Z',
    matchedPattern: 'ecdh_curves: ["P-256"]',
    context: {
      repository: 'github.com/enterprise/edge-gateway',
      commit: '7b28f11c',
      branch: 'production'
    }
  },
  {
    id: 'EVID-004',
    assetId: 'CRYPTO-00204',
    ruleId: 'SEC-SYM-AES-01',
    ruleName: 'Standard AES Encryption Mode',
    filePath: 'ledger/storage/encryption_service.java',
    startLine: 75,
    endLine: 88,
    codeSnippet: `public byte[] encryptLedgerBlock(byte[] plaintext, SecretKey key, byte[] iv) throws Exception {
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    cipher.init(Cipher.ENCRYPT_MODE, key, spec);
    return cipher.doFinal(plaintext);
}`,
    detector: 'java-bytecode-scanner',
    confidence: 0.998,
    detectedAt: '2026-09-17T08:30:00Z',
    matchedPattern: 'Cipher.getInstance("AES/GCM/NoPadding")',
    context: {
      repository: 'github.com/enterprise/settlement-engine',
      commit: 'c90a1e45',
      branch: 'master'
    }
  }
];
