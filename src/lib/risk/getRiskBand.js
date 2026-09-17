export function getRiskBand(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export function getRiskColor(band) {
  switch (band?.toLowerCase()) {
    case 'critical': return 'var(--risk-critical, #dc2626)';
    case 'high': return 'var(--risk-high, #f97316)';
    case 'medium': return 'var(--risk-medium, #eab308)';
    case 'low': return 'var(--risk-low, #10b981)';
    default: return 'var(--text-muted, #9ca3af)';
  }
}
