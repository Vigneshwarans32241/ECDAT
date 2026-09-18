import { useState, useRef } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { scanText } from '../../lib/scanner/scanText';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useToast } from '../../components/ui/Toast';
import { Play, Sparkles, Copy, Trash2, Upload, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
}`,
  c_openssl: `// C/C++ OpenSSL RSA Signing Routine
int sign_payload(const unsigned char *msg, size_t msglen, unsigned char **sig, size_t *siglen, EVP_PKEY *pkey) {
    EVP_MD_CTX *ctx = EVP_MD_CTX_new();
    EVP_DigestSignInit(ctx, NULL, EVP_sha256(), NULL, pkey);
    EVP_DigestSignUpdate(ctx, msg, msglen);
    EVP_DigestSignFinal(ctx, *sig, siglen);
    EVP_MD_CTX_free(ctx);
    return 1;
}`
};

export default function DemoScannerPage() {
  const [code, setCode] = useState(SAMPLES.go_rsa);
  const [findings, setFindings] = useState(() => scanText(SAMPLES.go_rsa));
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { addAsset } = useCryptoAssets();

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = scanText(code);
      setFindings(res);
      setIsScanning(false);
      toast.success(`Scan completed: detected ${res.length} cryptographic pattern${res.length === 1 ? '' : 's'}`);
    }, 250);
  };

  const handleLoadSample = (sampleKey, sampleName) => {
    setCode(SAMPLES[sampleKey]);
    const res = scanText(SAMPLES[sampleKey]);
    setFindings(res);
    toast.info(`Loaded ${sampleName} preset snippet`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Source code snippet copied to clipboard');
  };

  const handleClearCode = () => {
    setCode('');
    setFindings([]);
    toast.info('Code editor cleared');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      setCode(content);
      const res = scanText(content, file.name);
      setFindings(res);
      toast.success(`Uploaded and scanned ${file.name} (${res.length} findings)`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddFindingToCBOM = (finding) => {
    const newId = 'CRYPTO-' + Math.floor(10000 + Math.random() * 90000);
    const newAsset = {
      id: newId,
      assetType: 'algorithm',
      algorithm: {
        family: finding.family,
        name: finding.ruleName,
        variant: finding.matchedText,
        keySize: finding.family === 'RSA' ? 2048 : finding.family === 'ECC' ? 256 : 256
      },
      usage: {
        purpose: finding.family === 'RSA' || finding.family === 'ECC' ? 'digital_signature' : 'symmetric_encryption'
      },
      context: {
        applicationId: 'APP-SCAN',
        applicationName: 'Live Code Scanner Import',
        serviceName: finding.fileName || 'source_snippet',
        libraryName: 'Discovered Library'
      },
      classification: {
        dataSensitivity: 'high',
        businessCriticality: 'high',
        internetFacing: true
      },
      status: {
        classical: 'acceptable',
        quantum: finding.quantumStatus
      },
      confidence: finding.confidence,
      riskBand: finding.severity === 'critical' ? 'critical' : finding.severity === 'high' ? 'high' : 'low',
      migrationStatus: 'not_started',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };

    addAsset(newAsset);
    toast.success(`Added ${newId} (${finding.ruleName}) to global CBOM inventory!`);
    navigate('/inventory');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Live Interactive Cryptographic Pattern Scanner"
        subtitle="Test browser-side regex rules detecting RSA, ECDSA, AES, and PQC schemes directly from raw code"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".go,.py,.java,.js,.ts,.c,.cpp,.rs,.txt,.yaml"
            />
            <Button
              variant="outline"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Source File
            </Button>
            <Button
              variant="primary"
              icon={Play}
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : 'Run Pattern Scan'}
            </Button>
          </div>
        }
      />

      {/* Preset Selector */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#ffffff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="#1e40af" /> Load Sample Code:
        </span>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('go_rsa', 'Go RSA-2048')}>
          Go (RSA-2048 PSS)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('python_jwt', 'Python ECDSA')}>
          Python (ECDSA ES256)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('java_aes', 'Java AES-GCM')}>
          Java (AES-GCM)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('pqc_hybrid', 'PQC ML-KEM')}>
          PQC (X25519MLKEM768)
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleLoadSample('c_openssl', 'C/C++ OpenSSL')}>
          C/C++ (OpenSSL EVP)
        </Button>
      </div>

      {/* 2-Column Split: Code Input + Findings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Editor Box */}
        <Card
          title="Source Code Input"
          subtitle="Paste code or type live (instant AST regex detection)"
          action={
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button variant="outline" size="sm" icon={Copy} onClick={handleCopyCode}>
                Copy
              </Button>
              <Button variant="outline" size="sm" icon={Trash2} onClick={handleClearCode}>
                Clear
              </Button>
            </div>
          }
        >
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFindings(scanText(e.target.value));
            }}
            rows={15}
            placeholder="Paste code containing crypto invocations..."
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
        <Card
          title={`Discovered Signatures (${findings.length})`}
          subtitle="Real-time detector output with line matches"
        >
          {findings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              No cryptographic patterns matched the current rule set.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {findings.map((f) => (
                <div key={f.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Line {f.line} • {f.category}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '2px 0 0 0' }}>{f.ruleName}</h4>
                    </div>
                    <Badge variant={f.quantumStatus === 'vulnerable' ? 'critical' : f.quantumStatus === 'pqc_native' ? 'pqc' : 'low'}>
                      {f.quantumStatus?.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '11px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '6px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: '#0f172a', margin: '6px 0' }}>
                    Matched Pattern: <strong style={{ color: '#1e40af' }}>{f.matchedText}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '6px' }}>
                    <span>Confidence: {(f.confidence * 100).toFixed(0)}% (Rule: {f.ruleId})</span>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => handleAddFindingToCBOM(f)}
                    >
                      Add to CBOM Inventory
                    </Button>
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
