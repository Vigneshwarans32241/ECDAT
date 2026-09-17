import './Card.css';

export default function Card({ title, subtitle, action, className = '', children, padding = true }) {
  return (
    <div className={`card ${className}`.trim()}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className={`card-body ${padding ? 'card-body-padded' : ''}`.trim()}>
        {children}
      </div>
    </div>
  );
}
