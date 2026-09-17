import { useState } from 'react';
import { Search, Bell, Download, Plus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Topbar.css';

export default function Topbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/inventory');
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            placeholder="Global Search (RSA, ECDSA, apps, services...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="topbar-search-input"
          />
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-action" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Cluster: US-East-Primary</span>
        </div>
        <Link to="/reports">
          <button className="topbar-action" type="button">
            <Download size={15} />
            <span>Export CBOM</span>
          </button>
        </Link>
        <button className="topbar-icon-btn" type="button" aria-label="Notifications">
          <Bell size={17} />
          <span className="topbar-notification-dot"></span>
        </button>
        <Link to="/scans">
          <button className="topbar-btn-primary" type="button">
            <Plus size={15} />
            <span>New Scan</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
