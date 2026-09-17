export function formatRiskScore(score) {
  return typeof score === 'number' ? score.toFixed(0) : '--';
}

export function formatPercent(val) {
  return typeof val === 'number' ? `${val.toFixed(1)}%` : '--%';
}

export function formatDate(dateString) {
  if (!dateString) return '--';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '--';
  return Number(num).toLocaleString('en-US');
}
