import { useState } from 'react'
import { Search, Bell, Download, Plus, ShieldCheck, PanelLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import './Topbar.css'

export default function Topbar({ onToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-collapse-btn" type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <PanelLeft size={17} />
        </button>
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search assets, algorithms, applications"
            placeholder="Search assets, algorithms, applications..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={handleSearch}
            className="topbar-search-input"
          />
          <kbd>⌘ K</kbd>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-cluster"><span className="cluster-dot" /><span>US-East-Primary</span></div>
        <Link className="topbar-action" to="/reports"><Download size={15} /><span>Export CBOM</span></Link>
        <div className="topbar-notifications">
          <button className="topbar-icon-btn" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)}>
            <Bell size={17} /><span className="topbar-notification-dot" />
          </button>
          {notificationsOpen && (
            <div className="notification-popover" role="status">
              <strong>Attention needed</strong>
              <p>8 critical findings are ready for review.</p>
              <Link to="/risks" onClick={() => setNotificationsOpen(false)}>Open risk center →</Link>
            </div>
          )}
        </div>
        <Link className="topbar-btn-primary" to="/scans"><Plus size={15} /><span>New scan</span></Link>
      </div>
    </header>
  )
}
