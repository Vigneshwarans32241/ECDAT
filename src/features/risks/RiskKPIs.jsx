import KPICard from '../../components/ui/KPICard';
import { AlertOctagon, ShieldAlert, Cpu, Database } from 'lucide-react';

export default function RiskKPIs({ onSelectFilter }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
      <div onClick={() => onSelectFilter?.('critical')} style={{ cursor: 'pointer' }} title="Filter critical perimeter risks">
        <KPICard
          label="Critical Perimeter Risks"
          value="42"
          detail="Immediate PQC remediation ? Filter"
          icon={AlertOctagon}
          accentColor="#dc2626"
        />
      </div>
      <div onClick={() => onSelectFilter?.('high')} style={{ cursor: 'pointer' }} title="Filter high risk assets">
        <KPICard
          label="High Risk Assets"
          value="119"
          detail="Internet-facing classical crypto ? Filter"
          icon={ShieldAlert}
          accentColor="#f97316"
        />
      </div>
      <div onClick={() => onSelectFilter?.('quantum')} style={{ cursor: 'pointer' }} title="Filter Shor vulnerable assets">
        <KPICard
          label="Shor Vulnerable Assets"
          value="326"
          detail="RSA and Elliptic Curve total ? Filter"
          icon={Cpu}
          accentColor="#f59e0b"
        />
      </div>
      <div onClick={() => onSelectFilter?.('hndl')} style={{ cursor: 'pointer' }} title="Filter HNDL exposed stores">
        <KPICard
          label="HNDL Exposed Stores"
          value="74"
          detail="Long shelf-life sensitive data ? Filter"
          icon={Database}
          accentColor="#8b5cf6"
        />
      </div>
    </div>
  );
}
