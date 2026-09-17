import Card from '../../components/ui/Card';

export default function RiskDistributionChart({ distribution }) {
  const total = distribution?.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <Card title="Perimeter Risk Distribution" subtitle="Weighted by quantum threat & business criticality">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
        {/* Visual Multi-Segment Bar */}
        <div style={{ display: 'flex', height: '14px', borderRadius: '8px', overflow: 'hidden', background: '#e5e7eb' }}>
          {distribution?.map(item => {
            const pct = (item.value / total) * 100;
            return (
              <div
                key={item.id}
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color,
                  transition: 'width 0.4s ease'
                }}
                title={`${item.label}: ${item.value} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Legend with Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '8px' }}>
          {distribution?.map(item => {
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
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
