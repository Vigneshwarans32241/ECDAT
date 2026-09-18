import { useState, useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import RiskKPIs from './RiskKPIs';
import RiskMatrix from './RiskMatrix';
import HNDLPanel from './HNDLPanel';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import AssetDetailDrawer from '../inventory/AssetDetailDrawer';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { useToast } from '../../components/ui/Toast';
import { Eye, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RiskCenterPage() {
  const { rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets();
  const { addTask } = useMigrationPlans();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'critical' | 'high' | 'quantum' | 'hndl'
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredAssets = useMemo(() => {
    return rawAssets.filter((asset) => {
      if (search) {
        const q = search.toLowerCase();
        const matchId = asset.id?.toLowerCase().includes(q);
        const matchAlgo = asset.algorithm?.name?.toLowerCase().includes(q);
        const matchApp = asset.context?.applicationName?.toLowerCase().includes(q);
        if (!matchId && !matchAlgo && !matchApp) return false;
      }
      if (selectedApp && asset.context?.applicationName !== selectedApp) {
        return false;
      }
      if (activeFilter === 'critical' && asset.riskBand !== 'critical') return false;
      if (activeFilter === 'high' && asset.riskBand !== 'high') return false;
      if (activeFilter === 'quantum' && asset.status?.quantum !== 'vulnerable') return false;
      if (activeFilter === 'hndl' && asset.classification?.dataSensitivity !== 'high') return false;
      return true;
    });
  }, [rawAssets, search, selectedApp, activeFilter]);

  const handleInspectAsset = (asset) => {
    setSelectedAssetId(asset.id);
    setDrawerOpen(true);
  };

  const handleRemediate = (asset) => {
    addTask({
      title: `Remediate ${asset.context?.applicationName} (${asset.algorithm?.name})`,
      assetId: asset.id,
      applicationName: asset.context?.applicationName || 'Target App',
      stage: 'not_started',
      priority: asset.riskBand === 'critical' ? 'critical' : 'high',
      targetAlgorithm: 'ML-DSA-65 / ML-KEM-768'
    });
    toast.success(`Created migration task for ${asset.id}`);
    navigate('/migration');
  };

  const handleClearFilters = () => {
    setActiveFilter('all');
    setSelectedApp(null);
    setSelectedCategory(null);
    setSearch('');
    toast.info('Risk filters cleared');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Cryptographic Risk & Threat Center"
        subtitle="Multi-factor risk scoring evaluating quantum vulnerability, business criticality, and HNDL exposure"
      />

      <RiskKPIs onSelectFilter={(filterKey) => setActiveFilter(filterKey)} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <RiskMatrix
          selectedApp={selectedApp}
          onSelectApplication={(appName) => setSelectedApp(appName)}
        />
        <HNDLPanel
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            setActiveFilter(catName ? 'hndl' : 'all');
          }}
        />
      </div>

      <Card
        title={`Prioritized Risk Findings (${filteredAssets.length})`}
        subtitle="Cryptographic assets requiring architectural transition"
        action={
          (activeFilter !== 'all' || selectedApp || selectedCategory || search) && (
            <Button variant="outline" size="sm" icon={X} onClick={handleClearFilters}>
              Clear Active Filters
            </Button>
          )
        }
      >
        <div style={{ marginBottom: '14px', maxWidth: '320px' }}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search risk findings..."
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Asset</th>
                <th style={{ padding: '10px 14px' }}>Application</th>
                <th style={{ padding: '10px 14px' }}>Risk Band</th>
                <th style={{ padding: '10px 14px' }}>Quantum Threat Driver</th>
                <th style={{ padding: '10px 14px' }}>Remediation Scheme</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No findings match the current filter selection.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                      {asset.algorithm?.name} <span style={{ fontSize: '11px', color: '#64748b' }}>({asset.id})</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {asset.context?.applicationName}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <Badge variant={asset.riskBand}>{asset.riskBand}</Badge>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: '#334155' }}>
                      {asset.status?.quantum === 'vulnerable' ? 'Shor algorithm vulnerable; harvest risk' : 'Symmetric quantum resistant'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 500, color: '#1e40af' }}>
                      {asset.algorithm?.family === 'RSA' ? 'ML-DSA-65 Dual Signature' : asset.algorithm?.family === 'ECC' ? 'X25519MLKEM768 Hybrid' : 'Maintain AES-256'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleInspectAsset(asset)}
                        >
                          Inspect
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={ArrowRight}
                          onClick={() => handleRemediate(asset)}
                        >
                          Remediate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AssetDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
