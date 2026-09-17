import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './AppShell.css'

export default function AppShell({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''} ${mobileOpen ? 'mobile-nav-open' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <button
        className="mobile-nav-scrim"
        type="button"
        aria-label="Close navigation"
        onClick={() => setMobileOpen(false)}
      />
      <Sidebar collapsed={sidebarCollapsed} onNavigate={() => setMobileOpen(false)} />
      <div className="app-main">
        <Topbar
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main id="main-content" className="app-content" aria-live="polite">
          <div key={location.pathname} className="route-transition">
            {children}
          </div>
        </main>
      </div>
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((value) => !value)}
      >
        {mobileOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
    </div>
  )
}
