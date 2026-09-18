import { ShieldAlert, Cpu, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../components/ui/KPICard';

export default function KPIGrid({ kpis }) {
  const navigate = useNavigate();
  if (!kpis) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      <div onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }} title="Click to view all assets in inventory">
        <KPICard
          label="Total Cryptographic Assets"
          value={kpis.totalAssets?.toLocaleString()}
          detail="Discovered across 8 enterprise applications ? View all"
          icon={Cpu}
          accentColor="#1e40af"
        />
      </div>
      <div onClick={() => navigate('/inventory?quantum=vulnerable')} style={{ cursor: 'pointer' }} title="Click to filter quantum vulnerable assets">
        <KPICard
          label="Quantum Exposed Assets"
          value={kpis.quantumExposed?.toLocaleString()}
          detail={`${kpis.quantumExposedPercent}% of cryptographic perimeter ? Filter`}
          trend="Vulnerable to Shor Algorithm"
          icon={ShieldAlert}
          accentColor="#f59e0b"
        />
      </div>
      <div onClick={() => navigate('/inventory?risk=critical')} style={{ cursor: 'pointer' }} title="Click to filter critical risk findings">
        <KPICard
          label="Critical Risk Findings"
          value={kpis.criticalFindings?.toLocaleString()}
          detail={`${kpis.immediateReview} require immediate review ? Filter`}
          trend="Internet-facing or high criticality"
          icon={AlertTriangle}
          accentColor="#dc2626"
        />
      </div>
      <div onClick={() => navigate('/migration')} style={{ cursor: 'pointer' }} title="Click to open PQC Migration Center">
        <KPICard
          label="PQC Migration Progress"
          value={`${kpis.migrationProgressPercent}%`}
          detail={`${kpis.addressedAssets} of ${kpis.targetAssets} assets remediated ? Open Runway`}
          trend="Targeting FIPS 203/204 standard"
          icon={ArrowRightCircle}
          accentColor="#06b6d4"
        />
      </div>
    </div>
  );
}
