import './PageHeader.css'

export default function PageHeader({ breadcrumb, title, subtitle, badge, actions, children }) {
  return (
    <div className='page-header'>
      {breadcrumb && <div className='page-header-breadcrumb'>{breadcrumb}</div>}
      <div className='page-header-row'>
        <div className='page-header-left'>
          <h1 className='page-header-title'>
            {title}
            {badge && <span className='page-header-badge'>{badge}</span>}
          </h1>
          {subtitle && <p className='page-header-subtitle'>{subtitle}</p>}
        </div>
        {actions && <div className='page-header-actions'>{actions}</div>}
      </div>
      {children}
    </div>
  )
}