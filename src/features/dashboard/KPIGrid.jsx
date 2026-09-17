import { ShieldAlert, Cpu, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import KPICard from '../../components/ui/KPICard';

export default function KPIGrid({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="dashboard-kpi-grid">
      <KPICard
        label="Total Cryptographic Assets"
        value={kpis.totalAssets?.toLocaleString()}
        detail="Discovered across 8 enterprise applications"
        icon={Cpu}
        accentColor="#1e40af"
      />
      <KPICard
        label="Quantum Exposed Assets"
        value={kpis.quantumExposed?.toLocaleString()}
        detail={`${kpis.quantumExposedPercent}% of cryptographic perimeter`}
        trend="Vulnerable to Shor Algorithm"
        icon={ShieldAlert}
        accentColor="#f59e0b"
      />
      <KPICard
        label="Critical Risk Findings"
        value={kpis.criticalFindings?.toLocaleString()}
        detail={`${kpis.immediateReview} require immediate review`}
        trend="Internet-facing or high criticality"
        icon={AlertTriangle}
        accentColor="#dc2626"
      />
      <KPICard
        label="PQC Migration Progress"
        value={`${kpis.migrationProgressPercent}%`}
        detail={`${kpis.addressedAssets} of ${kpis.targetAssets} assets remediated`}
        trend="Targeting FIPS 203/204 standard"
        icon={ArrowRightCircle}
        accentColor="#06b6d4"
      />
    </div>
  );
}
