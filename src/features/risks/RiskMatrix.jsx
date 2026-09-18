import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function RiskMatrix({ onSelectApplication, selectedApp }) {
  const [zoneFilter, setZoneFilter] = useState('all');

  const applications = [
    { name: 'Payment API', x: 88, y: 92, risk: 'critical', zone: 'critical', size: 28 },
    { name: 'Identity Service', x: 82, y: 86, risk: 'critical', zone: 'critical', size: 24 },
    { name: 'Customer Portal', x: 74, y: 68, risk: 'high', zone: 'critical', size: 20 },
    { name: 'Settlement Engine', x: 25, y: 78, risk: 'medium', zone: 'safe', size: 18 },
    { name: 'Data Exchange Gateway', x: 45, y: 55, risk: 'medium', zone: 'safe', size: 16 },
    { name: 'Internal Analytics', x: 30, y: 35, risk: 'low', zone: 'safe', size: 14 }
  ];

  const visibleApps = zoneFilter === 'all'
    ? applications
    : applications.filter((a) => a.zone === zoneFilter);

  return (
    <Card
      title="Cryptographic Risk Matrix"
      subtitle="Business Criticality (Y) vs. Cryptographic Exposure (X)"
      action={
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant={zoneFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setZoneFilter('all')}
          >
            All
          </Button>
          <Button
            variant={zoneFilter === 'critical' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setZoneFilter('critical')}
          >
            Critical Zone
          </Button>
          <Button
            variant={zoneFilter === 'safe' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setZoneFilter('safe')}
          >
            Safe Zone
          </Button>
        </div>
      }
    >
      <div style={{ position: 'relative', height: '300px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '12px 0 8px 0', overflow: 'hidden' }}>
        {/* Quadrant Backgrounds */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1' }}>
          <span style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
            CRITICAL EXPOSURE ZONE
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', background: 'rgba(16, 185, 129, 0.06)' }}>
          <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '11px', fontWeight: 700, color: '#10b981' }}>
            LOW RISK ZONE
          </span>
        </div>

        {/* Dynamic Interactive Dots */}
        {visibleApps.map((app, idx) => {
          const isSelected = selectedApp === app.name;
          const color =
            app.risk === 'critical' ? '#dc2626' :
            app.risk === 'high' ? '#f97316' :
            app.risk === 'medium' ? '#eab308' : '#10b981';

          return (
            <div
              key={idx}
              onClick={() => onSelectApplication?.(isSelected ? null : app.name)}
              style={{
                position: 'absolute',
                left: `${app.x}%`,
                bottom: `${app.y}%`,
                transform: 'translate(-50%, 50%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: isSelected ? 10 : 2
              }}
              title={`${app.name}: Criticality ${app.y}%, Exposure ${app.x}% - Click to filter table`}
            >
              <div
                style={{
                  width: `${app.size}px`,
                  height: `${app.size}px`,
                  borderRadius: '50%',
                  backgroundColor: color,
                  opacity: 0.9,
                  boxShadow: isSelected ? '0 0 0 4px #2563eb' : '0 2px 6px rgba(0,0,0,0.15)',
                  border: '2px solid #ffffff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  transform: isSelected ? 'scale(1.3)' : 'scale(1)'
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? '#1e40af' : '#1e293b',
                  whiteSpace: 'nowrap',
                  background: isSelected ? '#eff6ff' : 'rgba(255,255,255,0.88)',
                  border: isSelected ? '1px solid #bfdbfe' : 'none',
                  padding: '2px 5px',
                  borderRadius: '4px'
                }}
              >
                {app.name}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
        <span>? Low Cryptographic Exposure</span>
        <span>High Cryptographic Exposure ?</span>
      </div>
    </Card>
  );
}
