import KPICard from '../../components/ui/KPICard';
import { AlertOctagon, ShieldAlert, Cpu, Database } from 'lucide-react';

export default function RiskKPIs() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
      <KPICard
        label="Critical Perimeter Risks"
        value="42"
        detail="Immediate PQC remediation"
        icon={AlertOctagon}
        accentColor="#dc2626"
      />
      <KPICard
        label="High Risk Assets"
        value="119"
        detail="Internet-facing classical crypto"
        icon={ShieldAlert}
        accentColor="#f97316"
      />
      <KPICard
        label="Shor Vulnerable Assets"
        value="326"
        detail="RSA and Elliptic Curve total"
        icon={Cpu}
        accentColor="#f59e0b"
      />
      <KPICard
        label="HNDL Exposed Stores"
        value="74"
        detail="Long shelf-life sensitive data"
        icon={Database}
        accentColor="#8b5cf6"
      />
    </div>
  );
}
