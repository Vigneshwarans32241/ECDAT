import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { storage } from '../../lib/storage';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [horizon, setHorizon] = useState(2034);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    storage.clearAll();
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="System Policies & Parameters"
        subtitle="Configure risk engine thresholds, quantum threat assumptions, and demo prototype controls"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Threat Assumptions */}
        <Card title="Quantum Threat Assumptions" subtitle="Global constants for Mosca timeline computations">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Estimated Cryptographically Relevant Quantum Computer (CRQC) Year
              </label>
              <input
                type="number"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                min="2028"
                max="2045"
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Default industry consensus: 2034 (8-year planning horizon).
              </span>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Default Financial Data Retention Shelf Life (Years)
              </label>
              <input
                type="number"
                defaultValue={15}
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
          </div>
        </Card>

        {/* Risk Weights */}
        <Card title="Multi-Factor Risk Weights" subtitle="Scoring configuration for cryptographic posture">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
              <span>Quantum Vulnerability Weight</span>
              <strong>35%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
              <span>Business Criticality Weight</span>
              <strong>25%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
              <span>Internet Exposure Weight</span>
              <strong>20%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '6px' }}>
              <span>Legacy Algorithm Depreciation</span>
              <strong>20%</strong>
            </div>
          </div>
        </Card>

        {/* Prototype Reset Controls */}
        <Card title="Prototype Demo Controls" subtitle="Reset local modifications or mock session data">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              All edits, checklist updates, added scans, and filter preferences are saved in browser storage. Click below to reset to initial seed state.
            </p>

            {resetSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
                <CheckCircle size={16} /> Data reset! Reloading prototype...
              </div>
            )}

            <div style={{ paddingTop: '8px' }}>
              <Button variant="danger" icon={RefreshCw} onClick={handleResetData}>
                Reset to Default Demo State
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
