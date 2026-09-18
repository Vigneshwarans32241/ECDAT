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
import { useToast } from '../../components/ui/Toast';
import AssetDetailDrawer from '../inventory/AssetDetailDrawer';
import Drawer from '../../components/ui/Drawer';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import { RefreshCw, Download, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: dashboardData, setData: setDashboardData } = useDashboard();
  const { rawAssets, selectedAsset, setSelectedAssetId } = useCryptoAssets();
  const { tasks, toggleChecklist } = useMigrationPlans();
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  const handleSelectAsset = (asset) => {
    setSelectedAssetId(asset.id);
    setAssetDrawerOpen(true);
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Refresh simulated metrics
      const newCritical = Math.floor(40 + Math.random() * 5);
      setDashboardData((prev) => ({
        ...prev,
        kpis: {
          ...prev.kpis,
          criticalFindings: newCritical,
          immediateReview: Math.floor(newCritical * 0.2)
        }
      }));
      setIsRefreshing(false);
      toast.success('Live cryptographic telemetry refreshed across 8 application clusters.');
    }, 600);
  };

  const handleExportCBOM = () => {
    const cbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: 'urn:uuid:ecdat-cbom-perimeter-export',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ vendor: 'ECDAT', name: 'Enterprise Cryptographic Discovery Tool', version: '1.0.0' }],
        component: { name: 'Full Enterprise Perimeter', type: 'application' }
      },
      cryptographicAssets: rawAssets
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cbom, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', 'enterprise_cbom_cyclonedx.json');
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    toast.success('CycloneDX 1.6 CBOM exported (1,284 assets).');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader
        title="Enterprise Cryptographic Posture"
        subtitle="Global discovery, quantum exposure assessment, and PQC transition metrics across enterprise systems"
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}
            </Button>
            <Link to="/scanner">
              <Button variant="secondary" icon={Play}>
                Demo Scanner
              </Button>
            </Link>
            <Button variant="primary" icon={Download} onClick={handleExportCBOM}>
              Export CBOM
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <KPIGrid kpis={dashboardData?.kpis} />

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <RiskDistributionChart distribution={dashboardData?.riskDistribution} />
        <AlgorithmDistributionChart algorithms={dashboardData?.algorithmDistribution} />
      </div>

      {/* Mosca Timing Exposure Summary */}
      <MoscaSummaryCard summary={dashboardData?.moscaSummary} />

      {/* Active Migration Section */}
      <MigrationPrioritySection
        tasks={tasks}
        onSelectTask={(task) => setSelectedTask(task)}
      />

      {/* High Priority Findings Table */}
      <CriticalFindingsTable
        assets={rawAssets}
        onSelectAsset={handleSelectAsset}
      />

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        isOpen={assetDrawerOpen}
        onClose={() => setAssetDrawerOpen(false)}
        asset={selectedAsset}
      />

      {/* Task Drawer */}
      <Drawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title}
        subtitle={`Task ID: ${selectedTask?.id} | Application: ${selectedTask?.applicationName}`}
        width={600}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link to="/migration">
              <Button variant="outline" size="sm">
                Open Full Kanban Board
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={() => setSelectedTask(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Owner</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedTask.owner}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Due Date</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedTask.dueDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Algorithm</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>{selectedTask.currentAlgorithm}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Target Scheme</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0284c7' }}>{selectedTask.targetAlgorithm}</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>Remediation Progress</span>
                <span style={{ fontWeight: 700, color: '#1e40af' }}>{selectedTask.progressPercent}%</span>
              </div>
              <ProgressBar value={selectedTask.progressPercent} max={100} height={8} color="#0284c7" />
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>Task Checklist</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTask.checklist?.map((chk) => (
                  <label
                    key={chk.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      background: chk.completed ? '#f0fdf4' : '#ffffff',
                      border: `1px solid ${chk.completed ? '#bbf7d0' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: chk.completed ? '#166534' : '#1e293b'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={chk.completed}
                      onChange={() => {
                        toggleChecklist(selectedTask.id, chk.id);
                        setSelectedTask((prev) => {
                          const updated = prev.checklist.map((c) =>
                            c.id === chk.id ? { ...c, completed: !c.completed } : c
                          );
                          const comp = updated.filter((c) => c.completed).length;
                          const pct = Math.round((comp / updated.length) * 100);
                          return { ...prev, checklist: updated, progressPercent: pct };
                        });
                        toast.info('Task checklist updated.');
                      }}
                    />
                    <span style={{ textDecoration: chk.completed ? 'line-through' : 'none' }}>
                      {chk.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
