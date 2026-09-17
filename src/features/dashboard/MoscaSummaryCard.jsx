import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowRight, Clock, AlertOctagon } from 'lucide-react';

export default function MoscaSummaryCard({ summary }) {
  return (
    <Card
      title="Mosca Quantum Risk Window"
      subtitle="Theorem: (Shelf Life X + Migration Time Y) > Threat Horizon Z"
      action={
        <Link to="/mosca">
          <Button variant="outline" size="sm" icon={ArrowRight}>
            Mosca Sandbox
          </Button>
        </Link>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fffbeb', padding: '14px 18px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
          <div style={{ color: '#d97706' }}>
            <AlertOctagon size={28} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#92400e' }}>
              3 Applications Operating at Negative Protection Margin
            </div>
            <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
              Average estimated quantum deficit is <strong>3.4 years</strong>. Immediate migration planning required to avoid Harvest-Now-Decrypt-Later (HNDL) data exposure.
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Estimated CRQC (Z)</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>Year 2034</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>8 Years Remaining</div>
          </div>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Max Data Shelf Life (X)</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#b45309', marginTop: '4px' }}>15 Years</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Financial & PCI Logs</div>
          </div>
          <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fee2e2' }}>
            <div style={{ fontSize: '11px', color: '#991b1b', textTransform: 'uppercase', fontWeight: 600 }}>Critical Deficit Window</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', marginTop: '4px' }}>-5 Years</div>
            <div style={{ fontSize: '11px', color: '#b91c1c' }}>Payment API Exposed</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
