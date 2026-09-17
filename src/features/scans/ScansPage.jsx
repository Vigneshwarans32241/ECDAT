import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useScans } from '../../hooks/useScans';
import { Plus, Play, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScansPage() {
  const { scans, addScan } = useScans();
  const [modalOpen, setModalOpen] = useState(false);
  const [scanName, setScanName] = useState('');
  const [scanTarget, setScanTarget] = useState('Payment Gateway (github.com/enterprise/checkout)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateScan = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newScan = {
        id: 'SCAN-' + Date.now().toString().slice(-6),
        name: scanName || 'On-Demand Repository CBOM Discovery',
        target: scanTarget,
        type: 'Source Repository AST',
        status: 'completed',
        startedAt: new Date().toISOString(),
        finishedAt: new Date(Date.now() + 45000).toISOString(),
        duration: '45s',
        triggeredBy: 'Security Lead (Manual)',
        stats: {
          filesScanned: 340,
          dependenciesAnalyzed: 82,
          certificatesInspected: 8,
          cryptoAssetsDiscovered: 42,
          quantumVulnerableFound: 14,
          criticalRisks: 3,
          newFindings: 2
        }
      };
      addScan(newScan);
      setIsSubmitting(false);
      setModalOpen(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Automated Discovery Scans"
        subtitle="Configure CI/CD integrations, container repository scans, and runtime telemetry discovery"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/scanner">
              <Button variant="secondary" icon={Play}>
                Launch Live Regex Scanner
              </Button>
            </Link>
            <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
              New Discovery Scan
            </Button>
          </div>
        }
      />

      <Card title="Discovery Pipeline History" subtitle="Recent automated cryptographic bill of materials scans">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Scan Name & Target</th>
                <th style={{ padding: '10px 14px' }}>Type</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Assets Discovered</th>
                <th style={{ padding: '10px 14px' }}>Quantum Vulnerable</th>
                <th style={{ padding: '10px 14px' }}>Duration</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.target}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>{s.type}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={s.status === 'completed' ? 'success' : s.status === 'running' ? 'info' : 'warning'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{s.stats?.cryptoAssetsDiscovered || 0}</td>
                  <td style={{ padding: '12px 14px', color: '#dc2626', fontWeight: 600 }}>{s.stats?.quantumVulnerableFound || 0}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{s.duration}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <Link to={`/scans/${s.id}`}>
                      <Button variant="outline" size="sm" icon={Eye}>
                        Report
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Scan Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Initiate Discovery Scan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateScan} disabled={isSubmitting}>
              {isSubmitting ? 'Triggering...' : 'Launch Scan'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Scan Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Identity Service Release v2.4 Audit"
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Scope & Target
            </label>
            <select
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            >
              <option value="Payment Gateway (github.com/enterprise/checkout)">Payment Gateway (github.com/enterprise/checkout)</option>
              <option value="Identity Provider (github.com/enterprise/iam)">Identity Provider (github.com/enterprise/iam)</option>
              <option value="Core Banking Ledger (github.com/enterprise/ledger)">Core Banking Ledger (github.com/enterprise/ledger)</option>
            </select>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>
            Discovery includes source code AST inspection, package manifest analysis, and TLS endpoint certificate validation.
          </div>
        </div>
      </Modal>
    </div>
  );
}
