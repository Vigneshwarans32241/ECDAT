import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Database } from 'lucide-react';

export default function HNDLPanel({ onSelectCategory, selectedCategory }) {
  const categories = [
    { name: 'Financial & Cardholder Data', shelfLife: '10-15 Years', count: 28, status: 'urgent' },
    { name: 'Identity & Authentication Credentials', shelfLife: '5-10 Years', count: 21, status: 'urgent' },
    { name: 'Regulated Medical & Customer PII', shelfLife: '7-12 Years', count: 15, status: 'vulnerable' },
    { name: 'Core Intellectual Property & Secrets', shelfLife: '10+ Years', count: 10, status: 'vulnerable' }
  ];

  return (
    <Card
      title="Harvest-Now-Decrypt-Later (HNDL) Threat Surface"
      subtitle="Encrypted records with shelf-life exceeding quantum threat horizon (Click to filter)"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.map((cat, i) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={i}
              onClick={() => onSelectCategory?.(isSelected ? null : cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: isSelected ? '#eff6ff' : '#f8fafc',
                borderRadius: '6px',
                border: `1px solid ${isSelected ? '#93c5fd' : '#e2e8f0'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#f8fafc';
              }}
              title="Click to filter findings by this HNDL category"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={16} color={isSelected ? '#1e40af' : '#475569'} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 600, color: '#0f172a' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Legal Shelf Life: {cat.shelfLife}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{cat.count} stores</span>
                <Badge variant={cat.status === 'urgent' ? 'critical' : 'high'}>
                  {cat.status === 'urgent' ? 'HNDL DEFICIT' : 'AT RISK'}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
