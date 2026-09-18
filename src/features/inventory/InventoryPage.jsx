import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import InventoryToolbar from './InventoryToolbar';
import InventoryKPIs from './InventoryKPIs';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AssetDetailDrawer from './AssetDetailDrawer';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { useToast } from '../../components/ui/Toast';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Layers, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Controlled values using searchParams as primary source of truth
  const search = searchParams.get('search') || '';
  const riskFilter = searchParams.get('risk') || 'all';
  const quantumFilter = searchParams.get('quantum') || 'all';
  const appFilter = searchParams.get('app') || 'all';
  const purposeFilter = searchParams.get('purpose') || 'all';

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'all') {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  // Sorting
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();
  const { addTask } = useMigrationPlans();

  const { rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets();

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return rawAssets.filter((item) => {
      if (search) {
        const q = search.toLowerCase().trim();
        const matchId = item.id?.toLowerCase().includes(q);
        const matchAlgo = item.algorithm?.name?.toLowerCase().includes(q);
        const matchFamily = item.algorithm?.family?.toLowerCase().includes(q);
        const matchApp = item.context?.applicationName?.toLowerCase().includes(q);
        const matchService = item.context?.serviceName?.toLowerCase().includes(q);
        const matchPurpose = item.usage?.purpose?.toLowerCase().includes(q);
        if (!matchId && !matchAlgo && !matchFamily && !matchApp && !matchService && !matchPurpose) {
          return false;
        }
      }
      if (riskFilter !== 'all' && item.riskBand !== riskFilter) return false;
      if (quantumFilter !== 'all' && item.status?.quantum !== quantumFilter) return false;
      if (appFilter !== 'all' && item.context?.applicationName !== appFilter && item.context?.applicationId !== appFilter) {
        return false;
      }
      if (purposeFilter !== 'all' && item.usage?.purpose !== purposeFilter) return false;
      return true;
    });
  }, [rawAssets, search, riskFilter, quantumFilter, appFilter, purposeFilter]);

  // Sorted Assets
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'algorithm') {
        aVal = a.algorithm?.name || '';
        bVal = b.algorithm?.name || '';
      } else if (sortField === 'application') {
        aVal = a.context?.applicationName || '';
        bVal = b.context?.applicationName || '';
      } else if (sortField === 'purpose') {
        aVal = a.usage?.purpose || '';
        bVal = b.usage?.purpose || '';
      } else if (sortField === 'quantum') {
        aVal = a.status?.quantum || '';
        bVal = b.status?.quantum || '';
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortField, sortDirection]);

  // Paginated Assets
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(sortedAssets.length / pageSize) || 1;
  const paginatedAssets = useMemo(() => {
    if (pageSize === 'all') return sortedAssets;
    const start = (currentPage - 1) * pageSize;
    return sortedAssets.slice(start, start + pageSize);
  }, [sortedAssets, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (asset) => {
    setSelectedAssetId(asset.id);
    setDrawerOpen(true);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === paginatedAssets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAssets.map((a) => a.id)));
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchMigrate = () => {
    let count = 0;
    selectedIds.forEach((id) => {
      const asset = rawAssets.find((a) => a.id === id);
      if (asset) {
        addTask({
          title: `Migrate ${asset.context?.applicationName} (${asset.algorithm?.name})`,
          assetId: asset.id,
          applicationName: asset.context?.applicationName || 'Target App',
          stage: 'not_started',
          priority: asset.riskBand === 'critical' ? 'critical' : 'high',
          targetAlgorithm: 'ML-DSA-65 / ML-KEM-768'
        });
        count++;
      }
    });
    toast.success(`Enrolled ${count} assets into PQC Migration Runway`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = (onlySelected = false) => {
    const listToExport = onlySelected
      ? rawAssets.filter((a) => selectedIds.has(a.id))
      : filteredAssets;

    const headers = ['Asset ID', 'Algorithm', 'Key Length', 'Purpose', 'Application', 'Service', 'Risk Band', 'Quantum Status', 'Migration'];
    const rows = listToExport.map((a) => [
      a.id,
      a.algorithm?.name || 'N/A',
      a.algorithm?.keySize || 'N/A',
      a.usage?.purpose || 'N/A',
      a.context?.applicationName || 'N/A',
      a.context?.serviceName || 'N/A',
      a.riskBand || 'N/A',
      a.status?.quantum || 'N/A',
      a.migrationStatus || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', onlySelected ? 'selected_crypto_assets.csv' : 'ecdat_inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${listToExport.length} assets to CSV`);
  };

  const handleExportCBOM = () => {
    const cbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: 'urn:uuid:ecdat-inventory-export',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ vendor: 'ECDAT', name: 'Enterprise Cryptographic Discovery Tool', version: '1.0.0' }],
        component: { name: 'Filtered Perimeter CBOM', type: 'application' }
      },
      cryptographicAssets: filteredAssets
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cbom, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'filtered_cbom_cyclonedx.json');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    toast.success(`Exported ${filteredAssets.length} assets as CycloneDX 1.6 CBOM`);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
    toast.info('All inventory filters cleared');
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortDirection === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Cryptographic Inventory (CBOM)"
        subtitle="Cryptographic Bill of Materials indexing all algorithms, certificates, and keys across workloads"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV(false)}>
              Export CSV
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={handleExportCBOM}>
              Export CycloneDX CBOM
            </Button>
          </div>
        }
      />

      <InventoryKPIs
        totalCount={rawAssets.length}
        vulnerableCount={rawAssets.filter((a) => a.status?.quantum === 'vulnerable').length}
        pqcCount={rawAssets.filter((a) => a.status?.quantum === 'pqc_native').length}
        lowRiskCount={rawAssets.filter((a) => a.riskBand === 'low').length}
      />

      <InventoryToolbar
        search={search}
        onSearchChange={(val) => updateParam('search', val)}
        riskFilter={riskFilter}
        onRiskFilterChange={(val) => updateParam('risk', val)}
        quantumFilter={quantumFilter}
        onQuantumFilterChange={(val) => updateParam('quantum', val)}
        appFilter={appFilter}
        onAppFilterChange={(val) => updateParam('app', val)}
        purposeFilter={purposeFilter}
        onPurposeFilterChange={(val) => updateParam('purpose', val)}
        onResetFilters={handleResetFilters}
        onExportCSV={() => handleExportCSV(false)}
      />

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1e40af'
        }}>
          <span style={{ fontWeight: 600 }}>
            {selectedIds.size} cryptographic asset{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" size="sm" icon={Layers} onClick={handleBatchMigrate}>
              Batch Migrate Selected
            </Button>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV(true)}>
              Export Selected
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setSelectedIds(new Set())}>
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Interactive Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={paginatedAssets.length > 0 && selectedIds.size === paginatedAssets.length}
                  onChange={handleToggleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Asset ID</span> {getSortIcon('id')}
                </div>
              </th>
              <th onClick={() => handleSort('algorithm')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Algorithm</span> {getSortIcon('algorithm')}
                </div>
              </th>
              <th onClick={() => handleSort('purpose')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Purpose</span> {getSortIcon('purpose')}
                </div>
              </th>
              <th onClick={() => handleSort('application')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Application & Service</span> {getSortIcon('application')}
                </div>
              </th>
              <th onClick={() => handleSort('quantum')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Quantum Status</span> {getSortIcon('quantum')}
                </div>
              </th>
              <th onClick={() => handleSort('riskBand')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Risk Band</span> {getSortIcon('riskBand')}
                </div>
              </th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssets.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No cryptographic assets matched your search and filter criteria.
                </td>
              </tr>
            ) : (
              paginatedAssets.map((row) => (
                <tr
                  key={row.id}
                  className="clickable"
                  onClick={() => handleRowClick(row)}
                  style={selectedIds.has(row.id) ? { background: '#f8fafc' } : undefined}
                >
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={(e) => handleToggleRow(row.id, e)}
                      aria-label={`Select ${row.id}`}
                    />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#1e40af' }}>
                    {row.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.algorithm?.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {row.algorithm?.family} {row.algorithm?.keySize ? `(${row.algorithm.keySize} bit)` : ''}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize', color: '#334155' }}>
                    {row.usage?.purpose?.replace(/_/g, ' ')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: '#0f172a' }}>{row.context?.applicationName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{row.context?.serviceName || 'default'}</div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        row.status?.quantum === 'vulnerable' ? 'high' :
                        row.status?.quantum === 'pqc_native' ? 'pqc' : 'low'
                      }
                    >
                      {row.status?.quantum?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={row.riskBand}>{row.riskBand}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(row);
                      }}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Showing {paginatedAssets.length} of {filteredAssets.length} assets</span>
          <span>•</span>
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '12px' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
        </div>

        {pageSize !== 'all' && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AssetDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
