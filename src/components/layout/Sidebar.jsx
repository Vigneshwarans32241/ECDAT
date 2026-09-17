import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanSearch, Database, ShieldAlert, Clock,
  Network, Lightbulb, ArrowRightLeft, FileText, Settings, Play
} from 'lucide-react';
import './Sidebar.css';

const navGroups = [
  {
    label: 'OPERATE',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/scans', icon: ScanSearch, label: 'Discovery Scans' },
      { to: '/inventory', icon: Database, label: 'Cryptographic CBOM' },
      { to: '/scanner', icon: Play, label: 'Interactive Scanner' },
    ]
  },
  {
    label: 'ANALYZE',
    items: [
      { to: '/risks', icon: ShieldAlert, label: 'Risk & Threat Center' },
      { to: '/mosca', icon: Clock, label: 'Mosca Timing Sandbox' },
      { to: '/graph', icon: Network, label: 'Dependency Graph' },
    ]
  },
  {
    label: 'MIGRATE',
    items: [
      { to: '/recommendations', icon: Lightbulb, label: 'PQC Guidance' },
      { to: '/migration', icon: ArrowRightLeft, label: 'Migration Runway' },
    ]
  },
  {
    label: 'REPORT & AUDIT',
    items: [
      { to: '/reports', icon: FileText, label: 'CBOM & Reports' },
    ]
  },
  {
    label: 'ADMIN',
    items: [
      { to: '/settings', icon: Settings, label: 'System Policies' },
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" stroke="#1e40af" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="4" fill="#1e40af" />
            <line x1="14" y1="5" x2="14" y2="9" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="19" x2="14" y2="23" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
            <line x1="5" y1="14" x2="9" y2="14" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="14" x2="23" y2="14" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">ECDAT</span>
          <span className="sidebar-subtitle">Crypto Observability</span>
        </div>
        <span className="sidebar-env-badge">PROD-US1</span>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map(group => (
          <div key={group.label} className="sidebar-group">
            <span className="sidebar-group-label">{group.label}</span>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-demo-badge">
          <span className="demo-dot"></span>
          Demo Dataset (v2026.04)
        </div>
        <div className="sidebar-demo-count">1,284 Assets Monitored</div>
      </div>
    </aside>
  );
}
