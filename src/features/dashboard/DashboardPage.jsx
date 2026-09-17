import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import KPIGrid from './KPIGrid';
import RiskDistributionChart from './RiskDistributionChart';
import AlgorithmDistributionChart from './AlgorithmDistributionChart';
import MoscaSummaryCard from './MoscaSummaryCard';
import CriticalFindingsTable from './CriticalFindingsTable';
import MigrationPrioritySection from './MigrationPrioritySection';
import { useDashboard } from '../../hooks/useDashboard';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { useMigrationPlans } from '../../hooks/useMigrationPlans';
import AssetDetailDrawer from '../inventory/AssetDetailDrawer';
import Button from '../../components/ui/Button';
import { Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const { data: dashboardData } = useDashboard();
  const { rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets();
  const { tasks } = useMigrationPlans();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectAsset = (asset) => {
    setSelectedAssetId(asset.id);
    setDrawerOpen(true);
  };

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Enterprise Cryptographic Posture"
        subtitle="Global discovery, quantum exposure assessment, and PQC transition metrics across enterprise systems"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/scanner">
              <Button variant="secondary" icon={Play}>
                Demo Scanner
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="primary" icon={Download}>
                Export CBOM
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <KPIGrid kpis={dashboardData?.kpis} />

      {/* Charts Grid */}
      <div className="dashboard-chart-grid">
        <RiskDistributionChart distribution={dashboardData?.riskDistribution} />
        <AlgorithmDistributionChart algorithms={dashboardData?.algorithmDistribution} />
      </div>

      {/* Mosca Timing Exposure Summary */}
      <MoscaSummaryCard summary={dashboardData?.moscaSummary} />

      {/* Active Migration Section */}
      <MigrationPrioritySection tasks={tasks} />

      {/* High Priority Findings Table */}
      <CriticalFindingsTable
        assets={rawAssets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
