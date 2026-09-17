import Card from '../../components/ui/Card';

export default function RiskMatrix() {
  const applications = [
    { name: 'Payment API', x: 88, y: 92, risk: 'critical', size: 28 },
    { name: 'Identity Service', x: 82, y: 86, risk: 'critical', size: 24 },
    { name: 'Customer Portal', x: 74, y: 68, risk: 'high', size: 20 },
    { name: 'Settlement Engine', x: 25, y: 78, risk: 'medium', size: 18 },
    { name: 'Data Gateway', x: 45, y: 55, risk: 'medium', size: 16 },
    { name: 'Analytics Service', x: 30, y: 35, risk: 'low', size: 14 }
  ];

  return (
    <Card title="Cryptographic Risk Matrix" subtitle="Business Criticality (Y) vs. Cryptographic Exposure (X)">
      <div style={{ position: 'relative', height: '300px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '12px 0 8px 0', overflow: 'hidden' }}>
        {/* Quadrant Backgrounds */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1' }}>
          <span style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>CRITICAL ZONE</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', background: 'rgba(16, 185, 129, 0.06)' }}>
          <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '11px', fontWeight: 700, color: '#10b981' }}>SAFE ZONE</span>
        </div>

        {/* Dots */}
        {applications.map((app, idx) => {
          const color = app.risk === 'critical' ? '#dc2626' : app.risk === 'high' ? '#f97316' : app.risk === 'medium' ? '#eab308' : '#10b981';
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${app.x}%`,
                bottom: `${app.y}%`,
                transform: 'translate(-50%, 50%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={`${app.name}: Criticality ${app.y}%, Exposure ${app.x}%`}
            >
              <div
                style={{
                  width: `${app.size}px`,
                  height: `${app.size}px`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  opacity: 0.85,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  border: '2px solid #ffffff'
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.85)', padding: '1px 4px', borderRadius: '4px' }}>
                {app.name}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
        <span>Low Crypto Exposure</span>
        <span>High Crypto Exposure ?</span>
      </div>
    </Card>
  );
}
