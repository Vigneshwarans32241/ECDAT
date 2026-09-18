import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Download, Plus, PanelLeft, ChevronDown, Check, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { useCryptoAssets } from '../../hooks/useCryptoAssets';
import { applications } from '../../mock/applications';
import './Topbar.css';

const CLUSTERS = [
  { id: 'us-east-prod', name: 'US-East-Primary (Prod)', region: 'us-east-1', status: 'online' },
  { id: 'eu-west-prod', name: 'EU-West-Core (Prod)', region: 'eu-west-1', status: 'online' },
  { id: 'staging-us2', name: 'Staging-US2 (Pre-prod)', region: 'us-east-2', status: 'online' },
  { id: 'sandbox-dev', name: 'Dev-Sandbox-01', region: 'us-west-2', status: 'offline' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Critical Quantum Exposure', desc: 'Payment API signing algorithm (RSA-2048) requires PQC transition.', link: '/inventory?risk=critical', time: '10m ago' },
  { id: 'notif-2', title: 'Nightly Scan Completed', desc: '1,284 cryptographic assets verified across 8 applications.', link: '/scans', time: '2h ago' },
  { id: 'notif-3', title: 'Mosca Theorem Deficit', desc: 'Customer Portal has an estimated -1 year quantum window deficit.', link: '/mosca', time: '5h ago' }
];

export default function Topbar({ onToggleSidebar, onOpenNewScan }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState(CLUSTERS[0]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const searchRef = useRef(null);
  const clusterRef = useRef(null);
  const notifRef = useRef(null);

  const navigate = useNavigate();
  const toast = useToast();
  const { rawAssets } = useCryptoAssets();

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setClusterOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (clusterRef.current && !clusterRef.current.contains(e.target)) {
        setClusterOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const matchingAssets = searchTerm.trim()
    ? rawAssets.filter(
        (a) =>
          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.algorithm?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.context?.applicationName?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingApps = searchTerm.trim()
    ? applications.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.id.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 2)
    : [];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setSearchOpen(false);
      navigate(`/inventory?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectResult = (path) => {
    setSearchOpen(false);
    setSearchTerm('');
    navigate(path);
  };

  const handleSwitchCluster = (cluster) => {
    setActiveCluster(cluster);
    setClusterOpen(false);
    toast.success(`Switched active cryptographic cluster to ${cluster.name}`);
  };

  const handleQuickExportCBOM = () => {
    const cbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: 'urn:uuid:ecdat-cbom-enterprise-perimeter',
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ vendor: 'ECDAT', name: 'Enterprise Cryptographic Discovery Tool', version: '1.0.0' }],
        component: { name: `Perimeter (${activeCluster.name})`, type: 'application' }
      },
      cryptographicAssets: rawAssets
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cbom, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `ecdat_cbom_${activeCluster.id}.json`);
    document.body.appendChild(dl);
    dl.click();
    document.body.removeChild(dl);
    toast.success('CycloneDX 1.6 CBOM exported successfully (1,284 assets)');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-collapse-btn"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={17} />
        </button>

        {/* Global Live Search */}
        <div className="topbar-search-container" ref={searchRef}>
          <div className="topbar-search">
            <Search size={16} className="topbar-search-icon" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search assets, algorithms, applications"
              placeholder="Search assets, algorithms, applications..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchOpen(Boolean(e.target.value.trim()));
              }}
              onFocus={() => setSearchOpen(Boolean(searchTerm.trim()))}
              onKeyDown={handleSearchSubmit}
              className="topbar-search-input"
            />
            <kbd>? K</kbd>
          </div>

          {searchOpen && (matchingAssets.length > 0 || matchingApps.length > 0) && (
            <div className="search-results-dropdown">
              {matchingAssets.length > 0 && (
                <div>
                  <div className="search-category-title">Cryptographic Assets</div>
                  {matchingAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="search-result-item"
                      onClick={() => handleSelectResult(`/inventory?search=${encodeURIComponent(asset.id)}`)}
                    >
                      <div className="search-item-main">
                        <span className="search-item-title">{asset.algorithm?.name} ({asset.id})</span>
                        <span className="search-item-subtitle">{asset.context?.applicationName} • {asset.riskBand?.toUpperCase()} RISK</span>
                      </div>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              )}

              {matchingApps.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <div className="search-category-title">Enterprise Applications</div>
                  {matchingApps.map((app) => (
                    <div
                      key={app.id}
                      className="search-result-item"
                      onClick={() => handleSelectResult(`/inventory?app=${encodeURIComponent(app.name)}`)}
                    >
                      <div className="search-item-main">
                        <span className="search-item-title">{app.name}</span>
                        <span className="search-item-subtitle">{app.description} • {app.criticality?.toUpperCase()}</span>
                      </div>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        {/* Cluster Switcher */}
        <div className="topbar-cluster-container" ref={clusterRef}>
          <button
            className="topbar-cluster"
            type="button"
            onClick={() => setClusterOpen((v) => !v)}
            aria-label="Select cluster environment"
          >
            <span className="cluster-dot" style={{ background: activeCluster.status === 'online' ? '#22c55e' : '#f59e0b' }} />
            <span>{activeCluster.name}</span>
            <ChevronDown size={14} />
          </button>

          {clusterOpen && (
            <div className="cluster-dropdown">
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>
                Select Cryptographic Perimeter
              </div>
              {CLUSTERS.map((c) => (
                <button
                  key={c.id}
                  className={`cluster-option ${activeCluster.id === c.id ? 'active' : ''}`}
                  onClick={() => handleSwitchCluster(c)}
                  type="button"
                >
                  <div>
                    <div>{c.name}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Region: {c.region}</div>
                  </div>
                  {activeCluster.id === c.id && <Check size={14} color="#1e40af" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Export CBOM */}
        <button
          className="topbar-action"
          type="button"
          onClick={handleQuickExportCBOM}
          title="Download machine-readable CycloneDX 1.6 CBOM JSON"
        >
          <Download size={15} />
          <span>Export CBOM</span>
        </button>

        {/* Notifications */}
        <div className="topbar-notifications" ref={notifRef}>
          <button
            className="topbar-icon-btn"
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((v) => !v)}
          >
            <Bell size={17} />
            {notifications.length > 0 && <span className="topbar-notification-dot" />}
          </button>

          {notificationsOpen && (
            <div className="notification-popover" role="dialog" aria-label="Notifications popover">
              <div className="notification-popover-header">
                <span>Security Alerts & Scans ({notifications.length})</span>
                {notifications.length > 0 && (
                  <button
                    className="notification-clear-btn"
                    onClick={() => {
                      setNotifications([]);
                      toast.info('Notifications cleared');
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="notification-empty">No unread notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link}
                      className="notification-item"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <strong>{n.title}</strong>
                      <p>{n.desc}</p>
                      <span className="notification-time">{n.time}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* New Scan */}
        <Link
          className="topbar-btn-primary"
          to="/scans"
          onClick={() => {
            if (onOpenNewScan) onOpenNewScan();
          }}
        >
          <Plus size={15} />
          <span>New scan</span>
        </Link>
      </div>
    </header>
  );
}
