import PageHeader from '../../components/layout/PageHeader';
import RiskKPIs from './RiskKPIs';
import RiskMatrix from './RiskMatrix';
import HNDLPanel from './HNDLPanel';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';

export default function RiskCenterPage() {
  const { rawAssets } = useCryptoAssets();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Cryptographic Risk & Threat Center"
        subtitle="Multi-factor risk scoring evaluating quantum vulnerability, business criticality, and HNDL exposure"
      />

      <RiskKPIs />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <RiskMatrix />
        <HNDLPanel />
      </div>

      <Card title="Prioritized Risk Findings" subtitle="Cryptographic assets requiring architectural transition">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Asset</th>
                <th style={{ padding: '10px 14px' }}>Application</th>
                <th style={{ padding: '10px 14px' }}>Risk Band</th>
                <th style={{ padding: '10px 14px' }}>Quantum Threat Driver</th>
                <th style={{ padding: '10px 14px' }}>Remediation Strategy</th>
              </tr>
            </thead>
            <tbody>
              {rawAssets.map(asset => (
                <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                    {asset.algorithm?.name} <span style={{ fontSize: '11px', color: '#64748b' }}>({asset.id})</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {asset.context?.applicationName}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={asset.riskBand}>{asset.riskBand}</Badge>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#334155' }}>
                    {asset.status?.quantum === 'vulnerable' ? 'Shor algorithm vulnerability; subject to retroactive harvest' : 'Symmetric quantum resistant'}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 500, color: '#1e40af' }}>
                    {asset.algorithm?.family === 'RSA' ? 'ML-DSA / Hybrid RSA Dual Signature' : asset.algorithm?.family === 'ECC' ? 'X25519MLKEM768 / ML-DSA' : 'Maintain AES-256'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
