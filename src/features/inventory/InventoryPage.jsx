import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import InventoryToolbar from './InventoryToolbar';
import InventoryKPIs from './InventoryKPIs';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AssetDetailDrawer from './AssetDetailDrawer';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { Eye } from 'lucide-react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [quantumFilter, setQuantumFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { assets, rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets({
    search,
    riskBand: riskFilter,
    quantum: quantumFilter
  });

  const handleRowClick = (asset) => {
    setSelectedAssetId(asset.id);
    setDrawerOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Asset ID', 'Algorithm', 'Purpose', 'Application', 'Risk Band', 'Quantum Status', 'Migration'];
    const rows = assets.map(a => [
      a.id,
      a.algorithm?.name || 'N/A',
      a.usage?.purpose || 'N/A',
      a.context?.applicationName || 'N/A',
      a.riskBand || 'N/A',
      a.status?.quantum || 'N/A',
      a.migrationStatus || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ecdat_cryptographic_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: 'Asset ID',
      key: 'id',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#1e40af' }}>
          {val}
        </span>
      )
    },
    {
      header: 'Algorithm',
      key: 'algorithm',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.algorithm?.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{row.algorithm?.family} {row.algorithm?.keySize ? `(${row.algorithm.keySize} bit)` : ''}</div>
        </div>
      )
    },
    {
      header: 'Cryptographic Purpose',
      key: 'usage',
      render: (_, row) => (
        <span style={{ textTransform: 'capitalize', color: '#334155' }}>
          {row.usage?.purpose?.replace(/_/g, ' ')}
        </span>
      )
    },
    {
      header: 'Application & Service',
      key: 'context',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 500, color: '#0f172a' }}>{row.context?.applicationName}</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>{row.context?.serviceName || 'default'}</div>
        </div>
      )
    },
    {
      header: 'Quantum Status',
      key: 'status',
      render: (_, row) => {
        const q = row.status?.quantum;
        const variant = q === 'vulnerable' ? 'high' : q === 'pqc_native' ? 'pqc' : 'low';
        return <Badge variant={variant}>{q?.replace('_', ' ')}</Badge>;
      }
    },
    {
      header: 'Risk Band',
      key: 'riskBand',
      render: (val) => <Badge variant={val}>{val}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button variant="outline" size="sm" icon={Eye} onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}>
          Inspect
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Cryptographic Inventory (CBOM)"
        subtitle="Cryptographic Bill of Materials indexing all algorithms, certificates, and keys across workloads"
      />

      <InventoryKPIs
        totalCount={rawAssets.length}
        vulnerableCount={rawAssets.filter(a => a.status?.quantum === 'vulnerable').length}
        pqcCount={rawAssets.filter(a => a.status?.quantum === 'pqc_native').length}
        lowRiskCount={rawAssets.filter(a => a.riskBand === 'low').length}
      />

      <InventoryToolbar
        search={search}
        onSearchChange={setSearch}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        quantumFilter={quantumFilter}
        onQuantumFilterChange={setQuantumFilter}
        onResetFilters={() => { setSearch(''); setRiskFilter('all'); setQuantumFilter('all'); }}
        onExportCSV={handleExportCSV}
      />

      <DataTable
        columns={columns}
        data={assets}
        onRowClick={handleRowClick}
        emptyMessage="No cryptographic assets match your search and filter criteria."
      />

      <AssetDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
