import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { calculateMosca } from '../../lib/mosca/calculateMosca';
import { mockMoscaAssessments } from '../../mock/mosca-assessments';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MoscaPage() {
  const [shelfLifeX, setShelfLifeX] = useState(10);
  const [migrationTimeY, setMigrationTimeY] = useState(3);
  const [threatHorizonZ, setThreatHorizonZ] = useState(8);

  const result = calculateMosca(shelfLifeX, migrationTimeY, threatHorizonZ);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Mosca Theorem Quantum Timing Sandbox"
        subtitle="Evaluate quantum exposure using Dr. Michele Mosca's Theorem: If (X + Y) > Z, your data is compromised"
      />

      {/* Interactive Sandbox Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Controls Card */}
        <Card title="Theorem Parameter Controls" subtitle="Adjust assumptions to simulate quantum runway">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Data Shelf Life (X): {shelfLifeX} Years</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Time data must remain confidential</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={shelfLifeX}
                onChange={(e) => setShelfLifeX(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Migration Time (Y): {migrationTimeY} Years</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Time required to deploy PQC</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={migrationTimeY}
                onChange={(e) => setMigrationTimeY(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Threat Horizon (Z): {threatHorizonZ} Years</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Estimated time until CRQC</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                value={threatHorizonZ}
                onChange={(e) => setThreatHorizonZ(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </Card>

        {/* Calculation Result Card */}
        <Card title="Computed Quantum Margin" subtitle="Mathematical theorem verdict">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: result.status === 'urgent' ? '#fee2e2' : result.status === 'vulnerable' ? '#fef3c7' : '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: result.status === 'urgent' ? '#dc2626' : result.status === 'vulnerable' ? '#d97706' : '#16a34a'
            }}>
              {result.status === 'urgent' ? <ShieldAlert size={40} /> : result.status === 'vulnerable' ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
            </div>

            <div>
              <Badge variant={result.status === 'urgent' ? 'critical' : result.status === 'vulnerable' ? 'high' : 'low'}>
                {result.badgeLabel}
              </Badge>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
                {result.margin > 0 ? `+${result.margin} Years` : `${result.margin} Years`}
              </div>
              <p style={{ fontSize: '13px', color: '#475569', maxWidth: '340px', margin: '6px auto 0 auto' }}>
                {result.recommendation}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '12px', width: '100%', justifyContent: 'center' }}>
              <span>Total Required (X+Y): <strong>{result.totalRequired} yrs</strong></span>
              <span>Available Horizon (Z): <strong>{result.threatHorizonZ} yrs</strong></span>
            </div>
          </div>
        </Card>
      </div>

      {/* Per Application Mosca Batch Table */}
      <Card title="Enterprise Application Mosca Assessments" subtitle="Evaluations based on application-specific data retention laws">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Application</th>
                <th style={{ padding: '10px 14px' }}>Data Category</th>
                <th style={{ padding: '10px 14px' }}>Shelf Life (X)</th>
                <th style={{ padding: '10px 14px' }}>Migration (Y)</th>
                <th style={{ padding: '10px 14px' }}>Horizon (Z)</th>
                <th style={{ padding: '10px 14px' }}>Protection Margin</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMoscaAssessments.map(item => (
                <tr key={item.applicationId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                    {item.applicationName}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {item.dataCategory}
                  </td>
                  <td style={{ padding: '12px 14px' }}>{item.shelfLifeX} yrs</td>
                  <td style={{ padding: '12px 14px' }}>{item.migrationTimeY} yrs</td>
                  <td style={{ padding: '12px 14px' }}>{item.threatHorizonZ} yrs</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: item.margin < 0 ? '#dc2626' : '#16a34a' }}>
                    {item.margin > 0 ? `+${item.margin} yrs` : `${item.margin} yrs`}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge variant={item.status === 'urgent' ? 'critical' : item.status === 'vulnerable' ? 'high' : 'low'}>
                      {item.status}
                    </Badge>
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
