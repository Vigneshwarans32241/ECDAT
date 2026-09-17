export const mockDashboardData = {
  kpis: {
    totalAssets: 1284,
    quantumExposed: 326,
    quantumExposedPercent: 25.4,
    criticalFindings: 42,
    immediateReview: 8,
    migrationProgressPercent: 38.0,
    addressedAssets: 124,
    targetAssets: 326
  },
  riskDistribution: [
    { id: 'critical', label: 'Critical', value: 42, color: '#dc2626' },
    { id: 'high', label: 'High', value: 119, color: '#f97316' },
    { id: 'medium', label: 'Medium', value: 345, color: '#eab308' },
    { id: 'low', label: 'Low', value: 778, color: '#10b981' }
  ],
  algorithmDistribution: [
    { algorithm: 'RSA-2048', count: 248, quantum: 'vulnerable' },
    { algorithm: 'AES-256', count: 480, quantum: 'safe' },
    { algorithm: 'ECDSA P-256', count: 184, quantum: 'vulnerable' },
    { algorithm: 'ECDH P-256', count: 112, quantum: 'vulnerable' },
    { algorithm: 'SHA-256', count: 160, quantum: 'safe' },
    { algorithm: 'ML-KEM / PQC', count: 45, quantum: 'pqc_native' },
    { algorithm: '3DES / SHA-1', count: 55, quantum: 'vulnerable' }
  ],
  moscaSummary: {
    averageDeficitYears: 3.4,
    threatHorizonYear: 2034,
    urgentApplicationsCount: 3,
    safeApplicationsCount: 5,
    hndlExposedTotal: 74
  }
};
