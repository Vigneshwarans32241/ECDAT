import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';

export default function RiskDistributionChart({ distribution }) {
  const navigate = useNavigate();
  const total = distribution?.reduce((acc, curr) => acc + curr.value, 0) || 1;

  const handleFilterRisk = (riskId) => {
    navigate(`/inventory?risk=${encodeURIComponent(riskId)}`);
  };

  return (
    <Card title="Perimeter Risk Distribution" subtitle="Weighted by quantum threat & business criticality (Click to filter)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
        {/* Visual Multi-Segment Bar */}
        <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden', background: '#e5e7eb', cursor: 'pointer' }}>
          {distribution?.map((item) => {
            const pct = (item.value / total) * 100;
            return (
              <div
                key={item.id}
                onClick={() => handleFilterRisk(item.id)}
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                title={`${item.label}: ${item.value} (${pct.toFixed(1)}%) - Click to filter`}
              />
            );
          })}
        </div>

        {/* Legend with Interactive Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '8px' }}>
          {distribution?.map((item) => {
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={item.id}
                onClick={() => handleFilterRisk(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                  e.currentTarget.style.borderColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                }}
                title={`Filter inventory by ${item.label} risk`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{item.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
