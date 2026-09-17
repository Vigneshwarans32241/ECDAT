import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import DashboardPage from '../features/dashboard/DashboardPage'
import ScansPage from '../features/scans/ScansPage'
import ScanDetailPage from '../features/scans/ScanDetailPage'
import InventoryPage from '../features/inventory/InventoryPage'
import RiskCenterPage from '../features/risks/RiskCenterPage'
import MoscaPage from '../features/mosca/MoscaPage'
import GraphPage from '../features/graph/GraphPage'
import RecommendationsPage from '../features/recommendations/RecommendationsPage'
import MigrationPage from '../features/migration/MigrationPage'
import ReportsPage from '../features/reports/ReportsPage'
import SettingsPage from '../features/settings/SettingsPage'
import DemoScannerPage from '../features/scanner/DemoScannerPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/scans' element={<ScansPage />} />
        <Route path='/scans/:scanId' element={<ScanDetailPage />} />
        <Route path='/inventory' element={<InventoryPage />} />
        <Route path='/risks' element={<RiskCenterPage />} />
        <Route path='/mosca' element={<MoscaPage />} />
        <Route path='/graph' element={<GraphPage />} />
        <Route path='/recommendations' element={<RecommendationsPage />} />
        <Route path='/migration' element={<MigrationPage />} />
        <Route path='/reports' element={<ReportsPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/scanner' element={<DemoScannerPage />} />
      </Routes>
    </AppShell>
  )
}
