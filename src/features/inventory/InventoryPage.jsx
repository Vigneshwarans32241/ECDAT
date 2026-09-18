import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import InventoryToolbar from './InventoryToolbar';
import InventoryKPIs from './InventoryKPIs';
import Button from '../../components/ui/Button';
import AssetDetailDrawer from './AssetDetailDrawer';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import { useToast } from '../../components/ui/Toast';
import { DataTable, DataTableViewOptions } from '../../components/ui/data-table';
import { getCbomColumns } from './cbom-columns';
import { Download, Layers, Sparkles } from 'lucide-react';

export default function InventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params as source of truth for high-level filters
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
  };

  const [selectedAssets, setSelectedAssets] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();
  const { addTask } = useMigrationPlans();
  const { rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets();

  // Filtered Assets based on toolbar controls
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

  const handleInspect = useCallback((asset) => {
    setSelectedAssetId(asset.id);
    setDrawerOpen(true);
  }, [setSelectedAssetId]);

  const handleMigrate = useCallback((asset) => {
    addTask({
      title: `Migrate ${asset.context?.applicationName || 'App'} (${asset.algorithm?.name || 'Algo'})`,
      assetId: asset.id,
      applicationName: asset.context?.applicationName || 'Target App',
      stage: 'not_started',
      priority: asset.riskBand === 'critical' ? 'critical' : 'high',
      targetAlgorithm: 'ML-DSA-65 / ML-KEM-768'
    });
    toast.success(`Enrolled ${asset.id} into PQC Migration Runway`);
  }, [addTask, toast]);

  const handleCopyId = useCallback((id) => {
    navigator.clipboard.writeText(id);
    toast.info(`Copied Asset ID ${id} to clipboard`);
  }, [toast]);

  const handleExportSnippet = useCallback((asset) => {
    const snippet = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      component: {
        type: 'cryptographic-asset',
        name: asset.id,
        algorithm: asset.algorithm,
        usage: asset.usage,
        context: asset.context,
        status: asset.status,
        riskBand: asset.riskBand
      }
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snippet, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `${asset.id}_cyclonedx_snippet.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    toast.success(`Exported CycloneDX 1.6 snippet for ${asset.id}`);
  }, [toast]);

  // TanStack Column Definitions
  const columns = useMemo(() => {
    return getCbomColumns({
      onInspect: handleInspect,
      onMigrate: handleMigrate,
      onCopyId: handleCopyId,
      onExportSnippet: handleExportSnippet
    });
  }, [handleInspect, handleMigrate, handleCopyId, handleExportSnippet]);

  const handleSelectionChange = useCallback((rows) => {
    setSelectedAssets(rows);
  }, []);

  const handleBatchMigrate = () => {
    let count = 0;
    selectedAssets.forEach((asset) => {
      addTask({
        title: `Migrate ${asset.context?.applicationName || 'App'} (${asset.algorithm?.name || 'Algo'})`,
        assetId: asset.id,
        applicationName: asset.context?.applicationName || 'Target App',
        stage: 'not_started',
        priority: asset.riskBand === 'critical' ? 'critical' : 'high',
        targetAlgorithm: 'ML-DSA-65 / ML-KEM-768'
      });
      count++;
    });
    toast.success(`Enrolled ${count} assets into PQC Migration Runway`);
  };

  const handleExportCSV = (onlySelected = false) => {
    const listToExport = onlySelected ? selectedAssets : filteredAssets;
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
    toast.info('All inventory filters cleared');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader
        title="Cryptographic Inventory (CBOM)"
        subtitle="Cryptographic Bill of Materials indexing algorithms, keys, certificates, and libraries using TanStack Table v9"
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

      {/* Floating Batch Action Bar */}
      {selectedAssets.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1e40af',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.08)'
        }}>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} />
            {selectedAssets.length} cryptographic asset{selectedAssets.length > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" size="sm" icon={Layers} onClick={handleBatchMigrate}>
              Batch Migrate Selected
            </Button>
            <Button variant="outline" size="sm" icon={Download} onClick={() => handleExportCSV(true)}>
              Export Selected ({selectedAssets.length})
            </Button>
          </div>
        </div>
      )}

      {/* TanStack Table v9 shadcn Data Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        onRowClick={handleInspect}
        onSelectionChange={handleSelectionChange}
        initialPageSize={25}
        emptyMessage="No cryptographic assets match the current filter criteria."
        toolbar={({ table }) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              Showing {table.getFilteredRowModel().rows.length} indexed components
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DataTableViewOptions table={table} />
            </div>
          </div>
        )}
      />

      {/* Detail Drawer */}
      <AssetDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
