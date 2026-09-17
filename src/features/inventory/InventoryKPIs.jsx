import KPICard from '../../components/ui/KPICard';
import { Database, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

export default function InventoryKPIs({ totalCount, vulnerableCount, pqcCount, lowRiskCount }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
      <KPICard
        label="Total Discovered Assets"
        value={totalCount}
        detail="Cataloged in CBOM"
        icon={Database}
        accentColor="#1e40af"
      />
      <KPICard
        label="Quantum Vulnerable"
        value={vulnerableCount}
        detail="Shor-algorithm exposure"
        icon={ShieldAlert}
        accentColor="#dc2626"
      />
      <KPICard
        label="PQC Native Schemes"
        value={pqcCount}
        detail="FIPS 203/204 standard"
        icon={Cpu}
        accentColor="#06b6d4"
      />
      <KPICard
        label="Low Risk Perimeter"
        value={lowRiskCount}
        detail="Compliant / Symmetric"
        icon={CheckCircle}
        accentColor="#10b981"
      />
    </div>
  );
}
