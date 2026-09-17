import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function CriticalFindingsTable({ assets, onSelectAsset }) {
  const criticalAssets = assets?.filter(a => a.riskBand === 'critical' || a.riskBand === 'high').slice(0, 5) || [];

  return (
    <Card
      title="High-Priority Cryptographic Assets"
      subtitle="Assets presenting immediate quantum exposure or high business risk"
      action={
        <Link to="/inventory">
          <Button variant="outline" size="sm" icon={ArrowRight}>
            View Inventory (1,284)
          </Button>
        </Link>
      }
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 12px' }}>Asset ID</th>
              <th style={{ padding: '8px 12px' }}>Algorithm</th>
              <th style={{ padding: '8px 12px' }}>Application</th>
              <th style={{ padding: '8px 12px' }}>Quantum Risk</th>
              <th style={{ padding: '8px 12px' }}>Migration Status</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {criticalAssets.map(asset => (
              <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => onSelectAsset?.(asset)}>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#1e40af' }}>
                  {asset.id}
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 500, color: '#0f172a' }}>
                  {asset.algorithm?.name || asset.algorithm}
                </td>
                <td style={{ padding: '10px 12px', color: '#475569' }}>
                  {asset.context?.applicationName}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge variant={asset.riskBand}>{asset.riskBand}</Badge>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge variant="info">{asset.migrationStatus?.replace('_', ' ')}</Badge>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <Button variant="outline" size="sm" icon={ExternalLink} onClick={(e) => { e.stopPropagation(); onSelectAsset?.(asset); }}>
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
