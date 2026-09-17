import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ScanSearch, Database, ShieldAlert, Clock,
  Network, Lightbulb, ArrowRightLeft, FileText, Settings, Play, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import './Sidebar.css'

const navGroups = [
  { label: 'Operate', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/scans', icon: ScanSearch, label: 'Discovery Scans' },
    { to: '/inventory', icon: Database, label: 'Cryptographic CBOM' },
    { to: '/scanner', icon: Play, label: 'Interactive Scanner' },
  ] },
  { label: 'Analyze', items: [
    { to: '/risks', icon: ShieldAlert, label: 'Risk & Threat Center' },
    { to: '/mosca', icon: Clock, label: 'Mosca Timing Sandbox' },
    { to: '/graph', icon: Network, label: 'Dependency Graph' },
  ] },
  { label: 'Migrate', items: [
    { to: '/recommendations', icon: Lightbulb, label: 'PQC Guidance' },
    { to: '/migration', icon: ArrowRightLeft, label: 'Migration Runway' },
  ] },
  { label: 'Report & audit', items: [{ to: '/reports', icon: FileText, label: 'CBOM & Reports' }] },
  { label: 'Admin', items: [{ to: '/settings', icon: Settings, label: 'System Policies' }] },
]

export default function Sidebar({ collapsed = false, onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-brand">
        <div className="sidebar-logo" aria-hidden="true"><span className="logo-orbit" /><span className="logo-core" /></div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">ECDAT</span>
          <span className="sidebar-subtitle">Crypto observability</span>
        </div>
        <span className="sidebar-env-badge">PROD</span>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-group">
            <span className="sidebar-group-label">{group.label}</span>
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onNavigate}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status-row"><span className="demo-dot" /> <span>All systems operational</span></div>
        <div className="sidebar-demo-count">Demo dataset · v2026.04</div>
        <div className="sidebar-demo-count">1,284 assets monitored</div>
      </div>
    </aside>
  )
}
