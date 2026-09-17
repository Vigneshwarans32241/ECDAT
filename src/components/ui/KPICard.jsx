import './KPICard.css'

export default function KPICard({ label, value, detail, icon: Icon, trend, accentColor }) {
  return (
    <div className='kpi-card' style={accentColor ? { borderTopColor: accentColor } : undefined}>
      <div className='kpi-card-top'>
        <span className='kpi-card-label'>{label}</span>
        {Icon && <span className='kpi-card-icon' style={accentColor ? { color: accentColor } : undefined}><Icon size={20} /></span>}
      </div>
      <div className='kpi-card-value'>{value}</div>
      {detail && <div className='kpi-card-detail'>{detail}</div>}
      {trend && <div className='kpi-card-trend'>{trend}</div>}
    </div>
  )
}