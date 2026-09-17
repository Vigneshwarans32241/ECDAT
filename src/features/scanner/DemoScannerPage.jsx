import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { scanText } from '../../lib/scanner/scanText';
import { Play, Sparkles } from 'lucide-react';

const SAMPLES = {
  go_rsa: `// Go Checkout Signer
func SignTransaction(payload []byte, privKey *rsa.PrivateKey) ([]byte, error) {
    hashed := sha256.Sum256(payload)
    opts := &rsa.PSSOptions{
        SaltLength: rsa.PSSSaltLengthEqualsHash,
        Hash:       crypto.SHA256,
    }
    return rsa.SignPSS(rand.Reader, privKey, crypto.SHA256, hashed[:], opts)
}`,
  python_jwt: `# Python OAuth2 JWT Signer
def generate_jwt_token(claims: dict, ec_key: EllipticCurvePrivateKey) -> str:
    header = {'alg': 'ES256', 'typ': 'JWT'}
    return jwt.encode(
        claims,
        ec_key,
        algorithm='ES256',
        headers=header
    )`,
  java_aes: `// Java Ledger Block Encryption
public byte[] encryptLedgerBlock(byte[] plaintext, SecretKey key, byte[] iv) throws Exception {
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    cipher.init(Cipher.ENCRYPT_MODE, key, spec);
    return cipher.doFinal(plaintext);
}`,
  pqc_hybrid: `// Post-Quantum TLS 1.3 Key Encapsulation
func setupPQCHandshake(conn *tls.Conn) {
    conn.SetSupportedCurves([]tls.CurveID{
        tls.X25519MLKEM768, // Hybrid NIST FIPS 203
        tls.CurveP256,
    })
}`
};

export default function DemoScannerPage() {
  const [code, setCode] = useState(SAMPLES.go_rsa);
  const [findings, setFindings] = useState(() => scanText(SAMPLES.go_rsa));

  const handleScan = () => {
    const res = scanText(code);
    setFindings(res);
  };

  const handleLoadSample = (sampleKey) => {
    setCode(SAMPLES[sampleKey]);
    setFindings(scanText(SAMPLES[sampleKey]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Live Interactive Cryptographic Pattern Scanner"
        subtitle="Test browser-side regex rules detecting RSA, ECDSA, AES, and PQC schemes directly from raw code"
        actions={
          <Button variant="primary" icon={Play} onClick={handleScan}>
            Run Pattern Scan
          </Button>
        }
      />

      {/* Preset Selector */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#ffffff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="#1e40af" /> Load Sample Code:
        </span>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('go_rsa')}>
          Go (RSA-2048 PSS)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('python_jwt')}>
          Python (ECDSA ES256)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('java_aes')}>
          Java (AES-GCM)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('pqc_hybrid')}>
          PQC (X25519MLKEM768)
        </Button>
      </div>

      {/* 2-Column Split: Code Input + Findings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Editor Box */}
        <Card title="Source Code Input" subtitle="Paste any snippet containing cryptographic calls">
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFindings(scanText(e.target.value));
            }}
            rows={14}
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: 1.6,
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #1e293b',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </Card>

        {/* Findings Box */}
        <Card title={`Discovered Cryptographic Signatures (${findings.length})`} subtitle="Real-time detector output">
          {findings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              No cryptographic signatures matched current detection rules.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {findings.map(f => (
                <div key={f.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Line {f.line} - {f.category}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '2px 0 0 0' }}>{f.ruleName}</h4>
                    </div>
                    <Badge variant={f.quantumStatus === 'vulnerable' ? 'critical' : f.quantumStatus === 'pqc_native' ? 'pqc' : 'low'}>
                      {f.quantumStatus?.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: '#0f172a', margin: '6px 0' }}>
                    Matched: <strong style={{ color: '#1e40af' }}>{f.matchedText}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                    <span>Rule ID: {f.ruleId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
