import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import KPICard from '../../components/ui/KPICard';
import { useScans } from '../../hooks/useScans';
import { ArrowLeft, ShieldAlert, Cpu, FileCode2, Download } from 'lucide-react';

export default function ScanDetailPage() {
  const { scanId } = useParams();
  const { scans } = useScans();
  const scan = scans.find(s => s.id === scanId) || scans[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title={`Discovery Report: ${scan?.name || scanId}`}
        subtitle={`ID: ${scan?.id} | Target: ${scan?.target}`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/scans">
              <Button variant="secondary" icon={ArrowLeft}>
                Back to Scans
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="primary" icon={Download}>
                Export Findings
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <KPICard
          label="Files Scanned"
          value={scan.stats?.filesScanned?.toLocaleString() || '14,820'}
          detail="Full repository AST tree"
          icon={FileCode2}
          accentColor="#1e40af"
        />
        <KPICard
          label="Crypto Assets Discovered"
          value={scan.stats?.cryptoAssetsDiscovered?.toLocaleString() || '1,284'}
          detail="Cataloged into CBOM"
          icon={Cpu}
          accentColor="#0284c7"
        />
        <KPICard
          label="Quantum Vulnerable"
          value={scan.stats?.quantumVulnerableFound?.toLocaleString() || '326'}
          detail="Classical asymmetric algorithms"
          icon={ShieldAlert}
          accentColor="#dc2626"
        />
        <KPICard
          label="Critical Findings"
          value={scan.stats?.criticalRisks?.toLocaleString() || '42'}
          detail="High exposure workloads"
          icon={ShieldAlert}
          accentColor="#f59e0b"
        />
      </div>

      <Card title="Discovery Pipeline Stages" subtitle="Deterministic 9-stage analysis execution">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { name: '1. Repository Checkout', status: 'Passed (2s)' },
            { name: '2. Language Detection', status: 'Passed (1s)' },
            { name: '3. AST Parsing & Regex', status: 'Passed (18s)' },
            { name: '4. Evidence Normalization', status: 'Passed (4s)' },
            { name: '5. Deduplication Engine', status: 'Passed (3s)' },
            { name: '6. CBOM Generation', status: 'Passed (2s)' },
            { name: '7. Multi-Factor Risk Scoring', status: 'Passed (2s)' },
            { name: '8. Mosca Window Compute', status: 'Passed (1s)' },
            { name: '9. PQC Recommendations', status: 'Passed (1s)' }
          ].map((stage, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>{stage.name}</span>
              <Badge variant="success">{stage.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
