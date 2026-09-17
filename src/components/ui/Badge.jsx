import './Badge.css';

const variants = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
  info: 'badge-info',
  pqc: 'badge-pqc',
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  deprecated: 'badge-deprecated',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  const variantClass = variants[variant] || 'badge-default';
  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
